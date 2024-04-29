import { EnglishLevel } from './level.model';

export interface Lesson {
  createdAt: Date;
  id: string;
  level: EnglishLevel;
  title: string;
  imageURL: string;
  completed?: boolean;
}

export interface LessonContent {
  contentHTML: string;
  lessonId: string;
  videoURL: string;
}

export interface LessonExtended extends Lesson, LessonContent {}
