export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  completed: boolean;
  dueDate: string;
}

export interface UserProgress {
  subjectId: string;
  score: number;
  totalQuizzes: number;
}
