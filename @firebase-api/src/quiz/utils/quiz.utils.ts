import { ENGLISH_LEVELS } from '../../shared/constants';
import {
  MINIMUM_CORRECT_ANSWERS,
  QuizExtended,
  QuizResult,
  QuizStatuses,
  UserAnswer,
} from '../../shared/models';

/**
 * A user must correctly answer at least 50% of the questions at a given level to pass that level.
 * A user must correctly answer at least 60% of all previous levels' questions to move on to the next level.
 * This function takes into account all these criteria.
 * It should work accurately under these rules, and it also takes care of the edge-case where a user answers higher-level questions
 * correctly but fails lower-level questions.
 */
export const calculateUserLevel = (
  quiz: QuizExtended[],
  userAnswers: UserAnswer[],
): QuizResult => {
  const LEVEL_PASS_THRESHOLD = 0.5;
  const TOTAL_PASS_THRESHOLD = 0.6;

  if (userAnswers.length === 0) {
    return {
      answerCount: 0,
      correctAnswers: 0,
      level: ENGLISH_LEVELS[0],
      status: QuizStatuses.INCOMPLETED,
    };
  }

  const correctAnswersByLevel = [0, 0, 0, 0, 0, 0];
  const totalQuestionsByLevel = [0, 0, 0, 0, 0, 0];
  let correctAnswers = 0;

  userAnswers.forEach(({ id, answer }: UserAnswer) => {
    const question = quiz.find((q) => q.id === id);

    if (question) {
      const levelIndex = ENGLISH_LEVELS.indexOf(question.level);

      if (answer === question.correctAnswer) {
        correctAnswersByLevel[levelIndex]++;
        correctAnswers++;
      }

      totalQuestionsByLevel[levelIndex]++;
    }
  });

  let userLevel = 0;

  for (let level = 5; level >= 0; level--) {
    const cumulativeCorrectAnswers = correctAnswersByLevel
      .slice(0, level + 1)
      .reduce((acc, curr) => acc + curr, 0);

    const cumulativeTotalQuestions = totalQuestionsByLevel
      .slice(0, level + 1)
      .reduce((acc, curr) => acc + curr, 0);

    const levelCorrectRatio =
      totalQuestionsByLevel[level] > 0
        ? correctAnswersByLevel[level] / totalQuestionsByLevel[level]
        : 0;

    const totalCorrectRatio =
      cumulativeTotalQuestions > 0
        ? cumulativeCorrectAnswers / cumulativeTotalQuestions
        : 0;

    if (
      levelCorrectRatio >= LEVEL_PASS_THRESHOLD &&
      totalCorrectRatio >= TOTAL_PASS_THRESHOLD
    ) {
      userLevel = level;
      break;
    }
  }

  return {
    answerCount: userAnswers.length,
    correctAnswers,
    level: ENGLISH_LEVELS[userLevel],
    status:
      correctAnswers > MINIMUM_CORRECT_ANSWERS
        ? QuizStatuses.COMPLETED
        : QuizStatuses.INCOMPLETED,
  };
};

export const checkLessonQuiz = (
  quiz: QuizExtended[],
  userAnswers: UserAnswer[],
): QuizResult => {
  const correctAnswers = quiz.filter((q) => {
    const userAnswer = userAnswers.find((a) => a.id === q.id);
    return userAnswer?.answer === q.correctAnswer;
  });

  return {
    answerCount: userAnswers.length,
    correctAnswers: correctAnswers.length,
    level: quiz[0].level,
    status:
      correctAnswers.length === quiz.length
        ? QuizStatuses.COMPLETED
        : QuizStatuses.INCOMPLETED,
  };
};
