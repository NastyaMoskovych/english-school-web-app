import { ENGLISH_LEVELS } from '../../shared/constants';
import { QuizExtended } from '../../shared/models';
import { calculateUserLevel } from './quiz.utils';

describe('QuizUtils', () => {
  describe('calculateUserLevel', () => {
    const baseQuizItem = {
      answers: ['A', 'B', 'C', 'D'],
      createdAt: new Date(),
      referenceId: 'exam',
    };

    const quiz: QuizExtended[] = [];

    for (let i = 0; i < 5; i++) {
      ENGLISH_LEVELS.forEach((level, idx: number) => {
        const id = `${i}-${idx}`;

        quiz.push({
          ...baseQuizItem,
          id,
          level,
          correctAnswer: 'A',
          question: `Question ${id}?`,
        });
      });
    }

    it('should return min level if no answers', () => {
      expect(calculateUserLevel(quiz, [])).toEqual({
        answerCount: 0,
        correctAnswers: 0,
        level: 'A1',
      });
    });

    it('should return min level if all answers are wrong', () => {
      const userAnswers = quiz.map(({ id }) => ({
        id,
        answer: 'wrong answer',
      }));

      expect(calculateUserLevel(quiz, userAnswers)).toEqual({
        answerCount: quiz.length,
        correctAnswers: 0,
        level: 'A1',
      });
    });

    it('should return max level if all answers are correct', () => {
      const userAnswers = quiz.map(({ id, correctAnswer }) => ({
        id,
        answer: correctAnswer,
      }));

      expect(calculateUserLevel(quiz, userAnswers)).toEqual({
        answerCount: quiz.length,
        correctAnswers: quiz.length,
        level: 'C2',
      });
    });

    it('should return correct level when lower level are passed', () => {
      const userAnswers = quiz.map(({ id, correctAnswer, level }) => ({
        id,
        answer: ['A1', 'A2', 'B1'].includes(level)
          ? correctAnswer
          : 'wrong answer',
      }));

      expect(calculateUserLevel(quiz, userAnswers)).toEqual({
        answerCount: quiz.length,
        correctAnswers: quiz.length / 2,
        level: 'B1',
      });
    });

    it('should return correct level when lower level are passed on 50%', () => {
      const userAnswers = [];

      ['A1', 'A2', 'B1'].forEach((level) => {
        quiz
          .filter((q) => q.level === level)
          .forEach(({ correctAnswer, id }, idx: number) => {
            console.log(idx);

            userAnswers.push({
              id,
              answer: idx % 2 === 0 ? correctAnswer : 'wrong answer',
            });
          });
      });

      expect(calculateUserLevel(quiz, userAnswers)).toEqual({
        answerCount: 15,
        correctAnswers: 9,
        level: 'B1',
      });
    });
  });
});
