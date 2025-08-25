"use server";

import { generateQuestionPaper } from "@/ai/flows/generate-question-paper-flow";
import {
  type GenerateQuestionPaperInput,
  GenerateQuestionPaperInputSchema,
  type GenerateQuestionPaperOutput,
} from "@/lib/schemas";

export async function getQuestionPaper(
  input: GenerateQuestionPaperInput
): Promise<GenerateQuestionPaperOutput | { error: string }> {
  try {
    const validatedInput = GenerateQuestionPaperInputSchema.safeParse(input);

    if (!validatedInput.success) {
      return { error: "Invalid input for generating question paper" };
    }

    const result = await generateQuestionPaper(validatedInput.data);
    return result;
  } catch (err: any) {
    console.error("❌ Error in getQuestionPaper:", err);
    return { error: "Failed to generate question paper" };
  }
}
