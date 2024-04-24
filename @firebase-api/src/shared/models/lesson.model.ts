export interface Lesson {
  createdAt: Date;
  id: string;
  level: string;
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
