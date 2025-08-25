import type { z } from 'zod';
import type { GenerateBilingualLessonContentInputSchema, GenerateBilingualLessonContentOutputSchema, GenerateSlidesInputSchema, GenerateSlidesOutputSchema, SlideSchema } from './schemas';


export type GenerateBilingualLessonContentInput = z.infer<
  typeof GenerateBilingualLessonContentInputSchema
>;

export type GenerateBilingualLessonContentOutput = z.infer<
  typeof GenerateBilingualLessonContentOutputSchema
>;

export interface LessonContent extends GenerateBilingualLessonContentOutput {}

export interface SavedLesson {
  id: string;
  topic: string;
  savedAt: string;
  lessonContent: LessonContent;
}


export type TeachingMethod = 'Analogy' | 'Story' | 'Mnemonic' | 'Worksheet' | 'Quiz' | 'Question Paper' | 'AI Summary';

export type Slide = z.infer<typeof SlideSchema>;

export type GenerateSlidesInput = z.infer<typeof GenerateSlidesInputSchema>;

export type GenerateSlidesOutput = z.infer<typeof GenerateSlidesOutputSchema>;
