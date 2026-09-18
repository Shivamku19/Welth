"use server";

// Phase 2 (AI Chatbot): 
// We will build the `chatWithFinances` Server Action here. 
// It will:
// 1. Authenticate the user.
// 2. Fetch their recent transactions and account balances from `db`.
// 3. Construct a prompt that feeds this data + the user's question to Gemini.
// 4. Return the AI's response to the frontend chat UI.

export async function chatWithFinances(userMessage) {
  // Placeholder for Phase 2 implementation
  return { success: false, message: "AI Chat not yet implemented (Phase 2)." };
}
