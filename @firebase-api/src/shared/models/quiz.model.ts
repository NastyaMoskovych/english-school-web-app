import { ENGLISH_LEVELS } from '../constants';

export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export enum QuizStatuses {
  COMPLETED = 'COMPLETED',
  INCOMPLETED = 'INCOMPLETED',
}

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

export interface QuizPayload {
  answers: UserAnswer[];
  uid?: string;
}

export interface QuizResult {
  answerCount: number;
  correctAnswers: number;
  level: EnglishLevel;
  sessionId?: string;
}

export interface QuizLessonResult {
  answerCount: number;
  correctAnswers: number;
  status: QuizStatuses;
}

export const MINIMUM_CORRECT_ANSWERS = 5;
