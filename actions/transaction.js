"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { inngest } from "@/lib/inngest/client";

// Helper to serialize Decimal fields
function serializeTransaction(transaction) {
  return {
    ...transaction,
    amount: transaction.amount.toNumber(),
  };
}

// Calculate the next recurring date based on the interval
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);
  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
      where: { id: data.accountId, userId: user.id },
    });
    if (!account) throw new Error("Account not found");

    const balanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: balanceChange } },
      });

      return newTransaction;
    });

    // Fire Inngest budget check event for expenses
    if (data.type === "EXPENSE") {
      await inngest.send({
        name: "budget.check",
        data: { userId: user.id },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeTransaction(transaction) };
  } catch (error) {
    console.error("Create transaction error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const original = await db.transaction.findUnique({
      where: { id, userId: user.id },
    });
    if (!original) throw new Error("Transaction not found");

    // Reverse original balance effect then apply new one
    const oldEffect =
      original.type === "EXPENSE"
        ? original.amount.toNumber()
        : -original.amount.toNumber();
    const newEffect = data.type === "EXPENSE" ? -data.amount : data.amount;
    const netBalanceChange = oldEffect + newEffect;

    const updated = await db.$transaction(async (tx) => {
      const updatedTx = await tx.transaction.update({
        where: { id, userId: user.id },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: netBalanceChange } },
      });

      return updatedTx;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeTransaction(updated) };
  } catch (error) {
    console.error("Update transaction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTransaction(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const transaction = await db.transaction.findUnique({
      where: { id, userId: user.id },
    });
    if (!transaction) throw new Error("Transaction not found");

    return serializeTransaction(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    return null;
  }
}

