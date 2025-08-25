export interface LessonContent {
  englishContent: string;
  kannadaContent: string;
  questionPaperEnglish?: string;
  answerKeyEnglish?: string;
  questionPaperKannada?: string;
  answerKeyKannada?: string;
}

export type TeachingMethod = 'Analogy' | 'Story' | 'Mnemonic' | 'Worksheet' | 'Quiz' | 'Question Paper' | 'AI Summary';
