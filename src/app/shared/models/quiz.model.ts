export interface Quiz {
  answers: string[];
  correctAnswer: string;
  createdAt: Date;
  id: string;
  level: string;
  question: string;
  referenceId: string;
}
