export interface Lesson {
  createdAt: Date;
  id: string;
  level: string;
  title: string;
}

export interface LessonContent {
  contentHTML: string;
  imageURL: string;
  lessonId: string;
  videoURL: string;
}

export interface LessonExtended extends Lesson, LessonContent {}
