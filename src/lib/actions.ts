"use server";

import { suggestTodoState, type AiSuggestTodoStateInput } from "@/ai/flows/ai-suggest-todo-state";

export async function getAiSuggestion(
  input: AiSuggestTodoStateInput
): Promise<string> {
  try {
    const result = await suggestTodoState(input);
    return result.suggestedState;
  } catch (error) {
    console.error("AI suggestion failed:", error);
    return "";
  }
}
