import { inngest } from "@/lib/inngest/client";
import { serve } from "inngest/next";
import { checkBudgetAlert, triggerRecurringTransactions } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlert,
    triggerRecurringTransactions,
  ],
});