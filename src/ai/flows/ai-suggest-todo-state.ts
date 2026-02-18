'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting a relevant state for a todo item
 * based on its description and due date, choosing from a list of user-defined states.
 *
 * - suggestTodoState - The main function to call for AI state suggestions.
 * - AiSuggestTodoStateInput - The input type for the suggestTodoState function.
 * - AiSuggestTodoStateOutput - The return type for the suggestTodoState function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSuggestTodoStateInputSchema = z.object({
  description: z.string().describe('The description of the todo item.'),
  dueDate: z.string().describe('The due date of the todo item in a human-readable format (e.g., "YYYY-MM-DD" or "today", "tomorrow").'),
  availableStates: z.array(z.string()).describe('A list of custom states defined by the user, e.g., ["todo", "ongoing", "completed", "shelved"].'),
});
export type AiSuggestTodoStateInput = z.infer<typeof AiSuggestTodoStateInputSchema>;

const AiSuggestTodoStateOutputSchema = z.object({
  suggestedState: z.string().describe('The suggested state for the todo item, chosen from the provided availableStates list.'),
});
export type AiSuggestTodoStateOutput = z.infer<typeof AiSuggestTodoStateOutputSchema>;

export async function suggestTodoState(input: AiSuggestTodoStateInput): Promise<AiSuggestTodoStateOutput> {
  return aiSuggestTodoStateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTodoStatePrompt',
  input: {schema: AiSuggestTodoStateInputSchema},
  output: {schema: AiSuggestTodoStateOutputSchema},
  prompt: `You are an AI assistant tasked with suggesting the most relevant state for a todo item.
You must choose one state from the provided 'availableStates' list.

Todo Description: {{{description}}}
Due Date: {{{dueDate}}}
Available States:
{{#each availableStates}}- {{this}}
{{/each}}

Based on the description and due date, please suggest the single most appropriate state from the 'availableStates' list. Your output MUST be one of the states exactly as provided in 'availableStates'.`,
});

const aiSuggestTodoStateFlow = ai.defineFlow(
  {
    name: 'aiSuggestTodoStateFlow',
    inputSchema: AiSuggestTodoStateInputSchema,
    outputSchema: AiSuggestTodoStateOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
