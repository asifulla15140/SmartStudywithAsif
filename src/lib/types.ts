import { z } from 'zod';

export interface LessonContent {
  englishContent: string;
  kannadaContent: string;
  urduContent: string;
  questionPaperEnglish?: string;
  answerKeyEnglish?: string;
  questionPaperKannada?: string;
  answerKeyKannada?: string;
  questionPaperUrdu?: string;
  answerKeyUrdu?: string;
  repeatedQuestionsEnglish?: string;
  repeatedAnswersEnglish?: string;
  repeatedQuestionsKannada?: string;
  repeatedAnswersKannada?: string;
  repeatedQuestionsUrdu?: string;
  repeatedAnswersUrdu?: string;
}

export interface SavedLesson {
  id: string;
  topic: string;
  savedAt: string;
  lessonContent: LessonContent;
}


export type TeachingMethod = 'Analogy' | 'Story' | 'Mnemonic' | 'Worksheet' | 'Quiz' | 'Question Paper' | 'AI Summary';

export const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.string().describe('The main content of the slide, formatted as markdown.'),
  speakerNotes: z.string().describe('Speaker notes for the slide.'),
});

export const GenerateSlidesInputSchema = z.object({
  lessonContent: z.string().describe("The full content of the lesson to be converted into slides."),
  topic: z.string().describe('The topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for the lesson.'),
});
export type GenerateSlidesInput = z.infer<typeof GenerateSlidesInputSchema>;

export const GenerateSlidesOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
});
export type GenerateSlidesOutput = z.infer<typeof GenerateSlidesOutputSchema>;
