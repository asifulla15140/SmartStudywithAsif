'use server';

/**
 * @fileOverview Generates presentation slides from lesson content.
 *
 * - generateSlides - A function that generates presentation slides.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateSlidesInput, GenerateSlidesOutput } from '@/lib/types';
import { GenerateSlidesInputSchema, GenerateSlidesOutputSchema, SlideSchema } from '@/lib/types';


export async function generateSlides(
  input: GenerateSlidesInput
): Promise<GenerateSlidesOutput> {
  return generateSlidesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSlidesPrompt',
  input: {schema: GenerateSlidesInputSchema},
  output: {schema: GenerateSlidesOutputSchema},
  prompt: `You are an expert in creating engaging presentations for students. Your task is to convert the following lesson content into a series of presentation slides.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Lesson Content:
  {{{lessonContent}}}

  Instructions:
  1.  Create a title slide.
  2.  Break down the lesson content into logical, easy-to-digest slides.
  3.  Each slide should have a clear title and concise bullet points or short paragraphs for the main content.
  4.  The content should be formatted using markdown.
  5.  For each slide, provide brief speaker notes that a teacher could use.
  6.  The number of slides should be appropriate for the amount of content, typically between 5 and 10 slides.
  7.  Ensure the language is appropriate for the specified grade level.
  8.  Your response MUST be a valid JSON object that adheres to the provided schema.`,
});


const generateSlidesFlow = ai.defineFlow(
  {
    name: 'generateSlidesFlow',
    inputSchema: GenerateSlidesInputSchema,
    outputSchema: GenerateSlidesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
