// src/ai/flows/generate-lesson-content.ts
'use server';

/**
 * @fileOverview Generates lesson content in English and Kannada based on specified topic, grade level, and teaching methods.
 *
 * - generateBilingualLessonContent - A function that generates the bilingual lesson content.
 * - GenerateBilingualLessonContentInput - The input type for the generateBilingualLessonContent function.
 * - GenerateBilingualLessonContentOutput - The return type for the generateBilingualLessonContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchWeb } from '../tools/web-search';

const GenerateBilingualLessonContentInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for the lesson.'),
  teachingMethods: z
    .array(z.string())
    .describe('The teaching methods to be used in the lesson.'),
});
export type GenerateBilingualLessonContentInput = z.infer<
  typeof GenerateBilingualLessonContentInputSchema
>;

const GenerateBilingualLessonContentOutputSchema = z.object({
  englishContent: z.string().describe('The lesson content in English. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  kannadaContent: z.string().describe('The lesson content in Kannada. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  questionPaperEnglish: z.string().optional().describe('The generated question paper in English. Only generated if "Question Paper" is a teaching method.'),
  answerKeyEnglish: z.string().optional().describe('The answer key for the English question paper. Only generated if "Question Paper" is a teaching method.'),
  questionPaperKannada: z.string().optional().describe('The generated question paper in Kannada. Only generated if "Question Paper" is a teaching method.'),
  answerKeyKannada: z.string().optional().describe('The answer key for the Kannada question paper. Only generated if "Question Paper" is a teaching method.'),
});
export type GenerateBilingualLessonContentOutput = z.infer<
  typeof GenerateBilingualLessonContentOutputSchema
>;

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
  tools: [searchWeb],
  prompt: `You are an experienced teacher creating a bilingual lesson plan.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Teaching Methods: {{#each teachingMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Use the searchWeb tool to find accurate and up-to-date information on the topic.

  Create lesson content in English and Kannada, tailored to the specified grade level and teaching methods.

  {{#if isQuestionPaper}}
  Generate a question paper for the given topic and grade level in both English and Kannada.
  Also, provide a separate answer key for each question paper.
  The 'englishContent' and 'kannadaContent' fields can contain a brief introduction or summary for the lesson.
  {{else}}
  Generate the lesson content based on the provided teaching methods.
  {{/if}}`,
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
