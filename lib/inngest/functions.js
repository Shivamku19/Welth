import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";

export const checkBudgetAlert = inngest.createFunction(
  { 
    id: "check-budget-alert", 
    name: "Check Budget Alert",
    triggers: [{ event: "budget.check" }]
  },
  async ({ event, step }) => {
    // We expect { userId, accountId, amount } in the event
    // We also support email for easy manual testing
    const { userId, email } = event.data;

    if (!userId && !email) {
      return { message: "Error: Missing userId or email in event data" };
    }

    // 1. Get the user's budget
    const budget = await step.run("fetch-budget", async () => {
      if (email) {
        // If testing via email, find user first
        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;
        return await db.budget.findUnique({
          where: { userId: user.id },
          include: { user: true },
        });
      } else {
        return await db.budget.findUnique({
          where: { userId },
          include: { user: true },
        });
      }
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

    const totalExpenses = Number(expenses._sum.amount || 0);
    const budgetAmount = Number(budget.amount);
    const percentUsed = (totalExpenses / budgetAmount) * 100;

    if (percentUsed >= 80) {
      // Send email alert if they exceed 80%
      await step.run("send-alert", async () => {
        console.log(`Sending alert to ${budget.user.email} - used ${percentUsed.toFixed(2)}%`);
        
        await sendEmail({
          to: "shivamgzp612005@gmail.com", // Hardcoded for testing - change back to budget.user.email in production
          subject: `Budget Alert for ${budget.user.name || budget.user.email.split("@")[0]}`,
          react: EmailTemplate({
            userName: budget.user.name || budget.user.email.split("@")[0],
            type: "budget-alert",
            data: {
              percentage: percentUsed,
              budgetAmount: parseInt(budgetAmount).toFixed(1),
              totalExpenses: parseInt(totalExpenses).toFixed(1),
            },
          }),
        });

        // Update lastAlertSent
        await db.budget.update({
          where: { id: budget.id },
          data: { lastAlertSent: new Date() },
        });
      });
    } else {
      await step.run("skip-alert", async () => {
        console.log(`Skipped alert: only ${percentUsed.toFixed(2)}% used (needs 80%)`);
      });
    }

    return { message: "Checked budget", percentUsed };
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
    triggers: [{ cron: "0 0 * * *" }],
  },
  async ({ step }) => {
    // 1. Fetch all due recurring transactions
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null }, // Never processed
              { nextRecurringDate: { lte: new Date() } }, // Due date passed
            ],
          },
        });
      }
    );

    // 2. Create events for each transaction
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: { transactionId: transaction.id, userId: transaction.userId },
      }));

      // 3. Send events to be processed
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    triggers: [{ event: "transaction.recurring.process" }],
    throttle: {
      limit: 10, // Only process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // per user
    },
  },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },

        include:{
          account:true,
        }
      });

      if (!transaction || !transaction.isRecurring) return;

      // Check if transaction is actually due
      if (!isTransactionDue(transaction)) return;

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

      await db.$transaction(async (tx) => {
        // Create the new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            receiptUrl: transaction.receiptUrl,
            isRecurring: false, // The duplicated one is not the parent
          },
        });

        // Update the parent's next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            nextRecurringDate: nextDate,
            lastProcessed: new Date(),
          },
        });

        // Update account balance
        const balanceChange = transaction.type === "EXPENSE" ? -transaction.amount.toNumber() : transaction.amount.toNumber();
        await tx.account.update({
          where: { id: transaction.accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      });

      // Trigger budget check
      await inngest.send({
        name: "budget.check",
        data: {
          userId: transaction.userId,
          accountId: transaction.accountId,
          amount: transaction.amount.toNumber(),
        },
      });
    });

    return { message: "Recurring transaction processed successfully" };
  }
);

// Helper function to check if a transaction is due
function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
    triggers: [{ cron: "0 0 1 * *" }],
  },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await db.transaction.groupBy({
          by: ["type"],
          where: {
            userId: user.id,
            date: {
              gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
              lte: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
            },
          },
          _sum: {
            amount: true,
          },
        });

        const incomes = stats.find((s) => s.type === "INCOME");
        const expenses = stats.find((s) => s.type === "EXPENSE");

        const income = incomes?._sum.amount?.toNumber() || 0;
        const expense = expenses?._sum.amount?.toNumber() || 0;

        await sendEmail({
          to: user.email, // using user.email since this is a global cron, we could hardcode to "shivamgzp612005@gmail.com" but for safety let's check what's requested. wait, in the budget one they hardcoded the testing email. let's keep it to user email but for testing might be better to hardcode. I will use user.email because otherwise one person gets thousands of emails if many users. Oh wait, the budget one explicitly says "// Hardcoded for testing - change back to budget.user.email in production". I'll use user.email.
          subject: `Your Monthly Financial Report - ${lastMonth.toLocaleString("default", { month: "long" })}`,
          react: EmailTemplate({
            userName: user.name || user.email.split("@")[0],
            type: "monthly-report",
            data: {
              income,
              expenses: expense,
              month: lastMonth.toLocaleString("default", { month: "long" }),
            },
          }),
        });
      });
    }

    return { processed: users.length };
  }
);