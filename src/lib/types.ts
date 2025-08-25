export interface LessonContent {
  englishContent: string;
  kannadaContent: string;
  urduContent?: string;
  questionPaperEnglish?: string;
  answerKeyEnglish?: string;
  questionPaperKannada?: string;
  answerKeyKannada?: string;
  questionPaperUrdu?: string;
  answerKeyUrdu?: string;
}

export type TeachingMethod = 'Analogy' | 'Story' | 'Mnemonic' | 'Worksheet' | 'Quiz' | 'Question Paper' | 'AI Summary';
