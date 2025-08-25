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
  englishContent: z.string().describe('The lesson content in English.'),
  kannadaContent: z.string().describe('The lesson content in Kannada.'),
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
  input: {schema: GenerateBilingualLessonContentInputSchema},
  output: {schema: GenerateBilingualLessonContentOutputSchema},
  prompt: `You are an experienced teacher creating a bilingual lesson plan.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Teaching Methods: {{#each teachingMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Create lesson content in English and Kannada, tailored to the specified grade level and teaching methods.

  English Content:
  {{englishContent}}

  Kannada Content:
  {{kannadaContent}}`,
});

const generateBilingualLessonContentFlow = ai.defineFlow(
  {
    name: 'generateBilingualLessonContentFlow',
    inputSchema: GenerateBilingualLessonContentInputSchema,
    outputSchema: GenerateBilingualLessonContentOutputSchema,
  },
  async input => {
    const {output} = await generateBilingualLessonContentPrompt(input);
    return output!;
  }
);
