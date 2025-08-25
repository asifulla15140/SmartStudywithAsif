'use server';

/**
 * @fileOverview A lesson content adaptation AI agent.
 *
 * - adaptLessonContent - A function that adapts lesson content based on teaching methods.
 * - AdaptLessonContentInput - The input type for the adaptLessonContent function.
 * - AdaptLessonContentOutput - The return type for the adaptLessonContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptLessonContentInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for the lesson.'),
  teachingMethods: z
    .array(z.string())
    .describe('The teaching methods to adapt the lesson for.'),
  contentEnglish: z.string().describe('The lesson content in English.'),
  contentKannada: z.string().describe('The lesson content in Kannada.'),
  contentUrdu: z.string().describe('The lesson content in Urdu.'),
});
export type AdaptLessonContentInput = z.infer<typeof AdaptLessonContentInputSchema>;

const AdaptLessonContentOutputSchema = z.object({
  adaptedContentEnglish: z.string().describe('The adapted lesson content in English.'),
  adaptedContentKannada: z.string().describe('The adapted lesson content in Kannada.'),
  adaptedContentUrdu: z.string().describe('The adapted lesson content in Urdu.'),
});
export type AdaptLessonContentOutput = z.infer<typeof AdaptLessonContentOutputSchema>;

export async function adaptLessonContent(
  input: AdaptLessonContentInput
): Promise<AdaptLessonContentOutput> {
  return adaptLessonContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptLessonContentPrompt',
  input: {schema: AdaptLessonContentInputSchema},
  output: {schema: AdaptLessonContentOutputSchema},
  prompt: `You are an experienced teacher, skilled in adapting lesson content for various teaching methods.

You will receive lesson content in English, Kannada, and Urdu, and you will adapt the content based on the specified teaching methods.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Teaching Methods: {{#each teachingMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

English Content: {{{contentEnglish}}}
Kannada Content: {{{contentKannada}}}
Urdu Content: {{{contentUrdu}}}

Please adapt the lesson content for the specified teaching methods, ensuring that the content is pedagogically sound and effective for different learning styles. Respond in all three languages in their respective keys.

Ensure the translated content is accurate and contextually relevant.`,
});

const adaptLessonContentFlow = ai.defineFlow(
  {
    name: 'adaptLessonContentFlow',
    inputSchema: AdaptLessonContentInputSchema,
    outputSchema: AdaptLessonContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
