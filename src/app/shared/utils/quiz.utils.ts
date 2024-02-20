import { ENGLISH_LEVELS } from '@firebase-api/constants';
import { EnglishLevel } from '@firebase-api/models';

export function getEnglishLevelPercent(level: EnglishLevel): number {
  const index = ENGLISH_LEVELS.indexOf(level);
  return Math.round(((index + 1) / ENGLISH_LEVELS.length) * 100);
}
