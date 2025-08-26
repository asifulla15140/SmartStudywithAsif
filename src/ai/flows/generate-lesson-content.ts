
// src/ai/flows/generate-lesson-content.ts
'use server';

/**
 * @fileOverview Generates lesson content in English, Kannada, and Urdu based on specified topic, grade level, and teaching methods.
 *
 * - generateBilingualLessonContent - A function that generates the lesson content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleSearch } from '@genkit-ai/googleai';
import type { GenerateBilingualLessonContentInput, GenerateBilingualLessonContentOutput } from '@/lib/types';
import { GenerateBilingualLessonContentInputSchema, GenerateBilingualLessonContentOutputSchema } from '@/lib/schemas';


export async function generateBilingualLessonContent(
  input: GenerateBilingualLessonContentInput
): Promise<GenerateBilingualLessonContentOutput> {
  return generateBilingualLessonContentFlow(input);
}

const generateBilingualLessonContentPrompt = ai.definePrompt({
  name: 'generateBilingualLessonContentPrompt',
  input: {schema: GenerateBilingualLessonContentInputSchema.extend({
    isQuestionPaper: z.boolean(),
  })},
  output: {schema: GenerateBilingualLessonContentOutputSchema},
  tools: [googleSearch],
  prompt: `You are an experienced teacher creating a lesson plan in English, Kannada, and Urdu. Your response MUST be a valid JSON object that adheres to the provided schema.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Teaching Methods: {{#each teachingMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Use the googleSearch tool to find accurate and up-to-date information on the topic.

  If the topic is about an author or multiple authors, you MUST include their names, a detailed biography, and information about their works in the lesson content for all three languages (English, Kannada, and Urdu). For broader topics like "Urdu Poetry," you MUST provide a detailed overview of the subject and include information about several key authors and their significant works.

  MANDATORY INSTRUCTION: You MUST generate content in English, Kannada, and Urdu. All English content must go into the 'englishContent', 'questionPaperEnglish', 'answerKeyEnglish', 'repeatedQuestionsEnglish', and 'repeatedAnswersEnglish' fields. All Kannada content must be an accurate translation and must go into the 'kannadaContent', 'questionPaperKannada', 'answerKeyKannada', 'repeatedQuestionsKannada', and 'repeatedAnswersKannada' fields. All Urdu content must be an accurate translation and must go into the 'urduContent', 'questionPaperUrdu', 'answerKeyUrdu', 'repeatedQuestionsUrdu', and 'repeatedAnswersUrdu' fields. DO NOT mix languages within a field. English fields should only contain English. Kannada fields should only contain Kannada. Urdu fields should only contain Urdu. Ensure all content is properly escaped to produce valid JSON. This is a strict requirement. For any fields that are not applicable, you MUST include them in the JSON response with an empty string "" as their value.

  Create lesson content tailored to the specified grade level and teaching methods.

  {{#if isQuestionPaper}}
  Generate a comprehensive and challenging question paper for the given topic and grade level, suitable for preparing students for exams up to the year 2025. The questions should be long and descriptive, not short or abrupt.
  The question paper should be well-structured and suitable for printing. Use a variety of question types (e.g., multiple choice, fill-in-the-blanks, short answer, long answer, essay writing, letter writing, and grammar exercises).
  Use a clear and organized formatting structure with Roman numerals (I, II, III) for sections, numbers (1, 2, 3) for questions, and letters (a, b, c) for sub-questions or options.

  Also, provide a separate, detailed answer key for each question paper. The answer key's format must correspond exactly to the question paper's format for easy reference. For subjective questions like essays or letter writing, you MUST provide a full, detailed model answer, not just key points. The answers should be comprehensive and provide a complete response to the question.

  The 'englishContent', 'kannadaContent', and 'urduContent' fields can contain a brief introduction or summary for the lesson.
  {{else}}
  Generate the lesson content based on the provided teaching methods. For any fields that are not applicable (e.g., question papers, answer keys), you MUST include them in the JSON response with an empty string "" as their value.
  {{/if}}

  Additionally, generate a large set of at least 10 extra, frequently repeated questions with their detailed answers for all three languages. These should be placed in the 'repeatedQuestions' and 'repeatedAnswers' fields for each language and are intended for private teacher reference.`,
});

const generateBilingualLessonContentFlow = ai.defineFlow(
  {
    name: 'generateBilingualLessonContentFlow',
    inputSchema: GenerateBilingualLessonContentInputSchema,
    outputSchema: GenerateBilingualLessonContentOutputSchema,
  },
  async (input) => {
    const isQuestionPaper = input.teachingMethods.includes('Question Paper');

    const augmentedInput = {
      ...input,
      isQuestionPaper,
    };
    const {output} = await generateBilingualLessonContentPrompt(augmentedInput);
    return output!;
  }
);
