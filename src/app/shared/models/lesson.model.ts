export interface LessonPayload {
  title: string;
  level: string;
}

export interface Lesson extends LessonPayload {
  id: string;
  createdAt: Date;
}

export interface LessonContent {
  imageURL: string;
  videoURL: string;
  contentHTML: string;
  lessonId: string;
}
