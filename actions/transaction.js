"use server";

import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

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

    //Get request data for ArcJet
    const req = await request();
    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    console.log("Arcjet decision:", decision.conclusion, "isDenied:", decision.isDenied(), "reason:", decision.reason);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request Blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

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
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function scanReceipt(base64String, mimeType) {
  try {
    if (!base64String) throw new Error("No image provided");
    
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    // No need to convert arrayBuffer anymore, we already have the base64 string
    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - amount: The total amount (number)
      - date: The date of the receipt (in ISO format)
      - description: A brief description of the receipt
      - category: The most appropriate category ID from this list: ["housing", "transportation", "groceries", "utilities", "entertainment", "food", "shopping", "healthcare", "education", "personal", "travel", "insurance", "gifts", "bills", "other-expense"]
      - merchantName: The name of the store or merchant

      Return strictly a JSON object with these fields, without any markdown formatting or additional text.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```(?:json)?\n?/g, "").replace(/```\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanText);
      return {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description,
        category: data.category,
        merchantName: data.merchantName,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error(error.message || "Failed to scan receipt");
  }
}
