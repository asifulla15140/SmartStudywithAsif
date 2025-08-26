'use server';

/**
 * @fileOverview Generates question papers in English, Kannada, and Urdu.
 *
 * - generateQuestionPaper - A function that generates the question paper.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateQuestionPaperInputSchema, GenerateQuestionPaperOutputSchema } from '@/lib/schemas';
import type { GenerateQuestionPaperInput, GenerateQuestionPaperOutput } from '@/lib/schemas';


export async function generateQuestionPaper(
  input: GenerateQuestionPaperInput
): Promise<GenerateQuestionPaperOutput> {
  return generateQuestionPaperFlow(input);
}

const generateQuestionPaperPrompt = ai.definePrompt({
  name: 'generateQuestionPaperPrompt',
  input: {schema: GenerateQuestionPaperInputSchema},
  output: {schema: GenerateQuestionPaperOutputSchema},
  prompt: `You are an experienced teacher creating a question paper in English, Kannada, and Urdu. Your response MUST be a valid JSON object that adheres to the provided schema.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}

  Use the googleSearch tool to find accurate and up-to-date information on the topic.

  MANDATORY INSTRUCTION: You MUST generate content in English, Kannada, and Urdu. All English content must go into the 'englishContent', 'questionPaperEnglish', 'answerKeyEnglish', 'repeatedQuestionsEnglish', and 'repeatedAnswersEnglish' fields. All Kannada content must be an accurate translation and must go into the 'kannadaContent', 'questionPaperKannada', 'answerKeyKannada', 'repeatedQuestionsKannada', and 'repeatedAnswersKannada' fields. All Urdu content must be an accurate translation and must go into the 'urduContent', 'questionPaperUrdu', 'answerKeyUrdu', 'repeatedQuestionsUrdu', and 'repeatedAnswersUrdu' fields. DO NOT mix languages within a field. English fields should only contain English. Kannada fields should only contain Kannada. Urdu fields should only contain Urdu. Ensure all content is properly escaped to produce valid JSON. This is a strict requirement.

  Generate a comprehensive and challenging question paper for the given topic and grade level, suitable for preparing students for exams up to the year 2025. The questions should be long and descriptive, not short or abrupt.
  The question paper should be well-structured and suitable for printing. Use a variety of question types (e.g., multiple choice, fill-in-the-blanks, short answer, long answer, essay writing, letter writing, and grammar exercises).
  Use a clear and organized formatting structure with Roman numerals (I, II, III) for sections, numbers (1, 2, 3) for questions, and letters (a, b, c) for sub-questions or options.
  
  Also, provide a separate, detailed answer key for each question paper. The answer key's format must correspond exactly to the question paper's format for easy reference. For subjective questions like essays or letter writing, you MUST provide a full, detailed model answer, not just key points. The answers should be comprehensive and provide a complete response to the question.

  The 'englishContent', 'kannadaContent', and 'urduContent' fields can contain a brief introduction or summary for the lesson.

  Additionally, generate a large set of at least 10 extra, frequently repeated questions with their detailed answers for all three languages. These should be placed in the 'repeatedQuestions' and 'repeatedAnswers' fields for each language and are intended for private teacher reference.`,
});

const generateQuestionPaperFlow = ai.defineFlow(
  {
    name: 'generateQuestionPaperFlow',
    inputSchema: GenerateQuestionPaperInputSchema,
    outputSchema: GenerateQuestionPaperOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuestionPaperPrompt(input);
    return output!;
  }
);
