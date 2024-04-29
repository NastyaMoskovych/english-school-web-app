import { EnglishLevel } from './level.model';

export const EXAM_REFERENCE_ID = 'exam';

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
  status: QuizStatuses;
  sessionId?: string;
  nextLevel?: EnglishLevel;
}

export const MINIMUM_CORRECT_ANSWERS = 5;
