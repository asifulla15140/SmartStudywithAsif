import { z } from 'zod';

export const GenerateBilingualLessonContentInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for the lesson.'),
  teachingMethods: z
    .array(z.string())
    .describe('The teaching methods to be used in the lesson.'),
});

export const GenerateBilingualLessonContentOutputSchema = z.object({
  englishContent: z.string().describe('The lesson content in English. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  kannadaContent: z.string().describe('The lesson content in Kannada. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  urduContent: z.string().describe('The lesson content in Urdu. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  questionPaperEnglish: z.string().optional().describe('The generated question paper in English. Only generated if "Question Paper" is a teaching method.'),
  answerKeyEnglish: z.string().optional().describe('The answer key for the English question paper. Only generated if "Question Paper" is a teaching method.'),
  questionPaperKannada: z.string().optional().describe('The generated question paper in Kannada. Only generated if "Question Paper" is a teaching method.'),
  answerKeyKannada: z.string().optional().describe('The answer key for the Kannada question paper. Only generated if "Question Paper" is a teaching method.'),
  questionPaperUrdu: z.string().optional().describe('The generated question paper in Urdu. Only generated if "Question Paper" is a teaching method.'),
  answerKeyUrdu: z.string().optional().describe('The answer key for the Urdu question paper. Only generated if "Question Paper" is a teaching method.'),
  repeatedQuestionsEnglish: z.string().optional().describe('A large set of extra repeated questions in English for teacher reference.'),
  repeatedAnswersEnglish: z.string().optional().describe('Detailed answers for the repeated questions in English.'),
  repeatedQuestionsKannada: z.string().optional().describe('A large set of extra repeated questions in Kannada for teacher reference.'),
  repeatedAnswersKannada: z.string().optional().describe('Detailed answers for the repeated questions in Kannada.'),
  repeatedQuestionsUrdu: z.string().optional().describe('A large set of extra repeated questions in Urdu for teacher reference.'),
  repeatedAnswersUrdu: z.string().optional().describe('Detailed answers for the repeated questions in Urdu.'),
});


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

export const GenerateSlidesOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
});

export const GenerateQuestionPaperInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson.'),
  gradeLevel: z.string().describe('The grade level for the lesson.'),
});
export type GenerateQuestionPaperInput = z.infer<typeof GenerateQuestionPaperInputSchema>;

export const GenerateQuestionPaperOutputSchema = GenerateBilingualLessonContentOutputSchema;
export type GenerateQuestionPaperOutput = z.infer<typeof GenerateQuestionPaperOutputSchema>;
