import { inngest } from "./client";
import { db } from "@/lib/prisma";

export const checkBudgetAlert = inngest.createFunction(
  { id: "check-budget-alert", name: "Check Budget Alert" },
  { event: "budget.check" },
  async ({ event, step }) => {
    // We expect { userId, accountId, amount } in the event
    const { userId } = event.data;

    // 1. Get the user's budget
    const budget = await step.run("get-budget", async () => {
      return await db.budget.findUnique({
        where: { userId },
        include: { user: true },
      });
    });

    if (!budget) return { message: "No budget found, skipping" };

    // 2. Calculate expenses for current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await step.run("get-expenses", async () => {
      return await db.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });
    });

    const totalExpenses = expenses._sum.amount?.toNumber() || 0;
    const budgetAmount = budget.amount.toNumber();
    const percentUsed = (totalExpenses / budgetAmount) * 100;

    if (percentUsed >= 80) {
      // Logic to send email here if they exceed 80%
      // e.g., send via Resend
      const result = await step.run("send-alert", async () => {
        // Here you would use Resend to send the alert
        console.log(`Sending alert to ${budget.user.email} - used ${percentUsed.toFixed(2)}%`);
        // Update lastAlertSent
        await db.budget.update({
          where: { id: budget.id },
          data: { lastAlertSent: new Date() },
        });
      });
    }

    return { message: "Checked budget", percentUsed };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  { id: "process-recurring-transaction", name: "Process Recurring Transactions" },
  { cron: "0 0 * * *" }, // Run daily at midnight
  async ({ step }) => {
    const dueTransactions = await step.run("fetch-due-transactions", async () => {
      return await db.transaction.findMany({
        where: {
          isRecurring: true,
          status: "COMPLETED",
          nextRecurringDate: { lte: new Date() },
        },
      });
    });

    if (dueTransactions.length === 0) {
      return { message: "No due transactions found" };
    }

    await step.run("process-transactions", async () => {
      for (const transaction of dueTransactions) {
        // Calculate next recurring date based on interval
        let nextDate = new Date(transaction.nextRecurringDate);
        if (transaction.recurringInterval === "DAILY") {
          nextDate.setDate(nextDate.getDate() + 1);
        } else if (transaction.recurringInterval === "WEEKLY") {
          nextDate.setDate(nextDate.getDate() + 7);
        } else if (transaction.recurringInterval === "MONTHLY") {
          nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (transaction.recurringInterval === "YEARLY") {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        // Create the new transaction
        await db.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            date: new Date(),
            category: transaction.category,
            status: "COMPLETED",
            userId: transaction.userId,
            accountId: transaction.accountId,
            receiptUrl: transaction.receiptUrl,
            isRecurring: false, // The duplicated one is not the parent
          },
        });

        // Update the parent's next recurring date
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            nextRecurringDate: nextDate,
            lastProcessed: new Date(),
          },
        });
      }
    });

    return { message: `Processed ${dueTransactions.length} recurring transactions` };
  }
);