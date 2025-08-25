
// src/ai/flows/generate-lesson-content.ts
'use server';

/**
 * @fileOverview Generates lesson content in English, Kannada, and Urdu based on specified topic, grade level, and teaching methods.
 *
 * - generateBilingualLessonContent - A function that generates the lesson content.
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
  urduContent: z.string().describe('The lesson content in Urdu. If "Question Paper" is not a teaching method, this will be the primary content. If it is, this can be a summary or introduction.'),
  questionPaperEnglish: z.string().optional().describe('The generated question paper in English. Only generated if "Question Paper" is a teaching method.'),
  answerKeyEnglish: z.string().optional().describe('The answer key for the English question paper. Only generated if "Question Paper" is a teaching method.'),
  questionPaperKannada: z.string().optional().describe('The generated question paper in Kannada. Only generated if "Question Paper" is a teaching method.'),
  answerKeyKannada: z.string().optional().describe('The answer key for the Kannada question paper. Only generated if "Question Paper" is a teaching method.'),
  questionPaperUrdu: z.string().optional().describe('The generated question paper in Urdu. Only generated if "Question Paper" is a teaching method.'),
  answerKeyUrdu: z.string().optional().describe('The answer key for the Urdu question paper. Only generated if "Question Paper" is a teaching method.'),
  repeatedQuestionsEnglish: z.string().optional().describe('Extra repeated questions in English for teacher reference.'),
  repeatedAnswersEnglish: z.string().optional().describe('Answers for the repeated questions in English.'),
  repeatedQuestionsKannada: z.string().optional().describe('Extra repeated questions in Kannada for teacher reference.'),
  repeatedAnswersKannada: z.string().optional().describe('Answers for the repeated questions in Kannada.'),
  repeatedQuestionsUrdu: z.string().optional().describe('Extra repeated questions in Urdu for teacher reference.'),
  repeatedAnswersUrdu: z.string().optional().describe('Answers for the repeated questions in Urdu.'),
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
  prompt: `You are an experienced teacher creating a lesson plan in English, Kannada, and Urdu. Your response MUST be a valid JSON object that adheres to the provided schema.

  Topic: {{{topic}}}
  Grade Level: {{{gradeLevel}}}
  Teaching Methods: {{#each teachingMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Use the searchWeb tool to find accurate and up-to-date information on the topic.

  If the topic is about an author or multiple authors, you MUST include their names, a detailed biography, and information about their works in the lesson content for all three languages (English, Kannada, and Urdu). For broader topics like "Urdu Poetry," you MUST provide a detailed overview of the subject and include information about several key authors and their significant works.

  MANDATORY INSTRUCTION: You MUST generate content in English, Kannada, and Urdu. All English content must go into the 'englishContent', 'questionPaperEnglish', 'answerKeyEnglish', 'repeatedQuestionsEnglish', and 'repeatedAnswersEnglish' fields. All Kannada content must be an accurate translation and must go into the 'kannadaContent', 'questionPaperKannada', 'answerKeyKannada', 'repeatedQuestionsKannada', and 'repeatedAnswersKannada' fields. All Urdu content must be an accurate translation and must go into the 'urduContent', 'questionPaperUrdu', 'answerKeyUrdu', 'repeatedQuestionsUrdu', and 'repeatedAnswersUrdu' fields. DO NOT mix languages within a field. English fields should only contain English. Kannada fields should only contain Kannada. Urdu fields should only contain Urdu. Ensure all content is properly escaped to produce valid JSON. This is a strict requirement.

  Create lesson content tailored to the specified grade level and teaching methods.

  {{#if isQuestionPaper}}
  Generate a comprehensive and challenging question paper for the given topic and grade level, suitable for preparing students for exams up to the year 2025. The questions should be long and descriptive, not short or abrupt.
  The question paper should be well-structured and suitable for printing. Use a variety of question types (e.g., multiple choice, fill-in-the-blanks, short answer, long answer, essay writing, letter writing, and grammar exercises).
  Use a clear and organized formatting structure with Roman numerals (I, II, III) for sections, numbers (1, 2, 3) for questions, and letters (a, b, c) for sub-questions or options.
  
  Also, provide a separate, detailed answer key for each question paper. The answer key's format must correspond exactly to the question paper's format for easy reference. For subjective questions like essays or letter writing, you MUST provide a full, detailed model answer, not just key points. The answers should be comprehensive and provide a complete response to the question.

  The 'englishContent', 'kannadaContent', and 'urduContent' fields can contain a brief introduction or summary for the lesson.
  {{else}}
  Generate the lesson content based on the provided teaching methods.
  {{/if}}

  Additionally, generate a set of extra, frequently repeated questions with their detailed answers for all three languages. These should be placed in the 'repeatedQuestions' and 'repeatedAnswers' fields for each language and are intended for private teacher reference.`,
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

