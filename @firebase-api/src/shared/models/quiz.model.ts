import { ENGLISH_LEVELS } from '../constants';

export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export interface Quiz {
  answers: string[];
  id: string;
  question: string;
}

export interface QuizExtended extends Quiz {
  correctAnswer: string;
  createdAt: Date;
  level: EnglishLevel;
  referenceId: string;
}

export interface UserAnswer {
  answer: string;
  id: string;
}

export interface QuizResult {
  answerCount: number;
  correctAnswers: number;
  level: EnglishLevel;
}
