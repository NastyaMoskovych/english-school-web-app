export interface Quiz {
  answers: string[];
  id: string;
  question: string;
}

export interface QuizExtended extends Quiz {
  correctAnswer: string;
  createdAt: Date;
  level: string;
  referenceId: string;
}

export interface UserAnswer {
  answer: string;
  id: string;
}
