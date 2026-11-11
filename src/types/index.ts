export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface Student {
  id: string;
  fullName: string;
  grade: GradeNumber;
  className: string;
  createdAt: string;
  totalPoints: number;
  completedStations: number[];
  badges: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  stationId: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'scenario' | 'math';
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  points: number;
  gradeLevels: GradeNumber[];
  difficulty: 'easy' | 'medium' | 'hard';
  version: number;
  isActive: boolean;
  sortOrder?: number;
}

export interface AttemptAnswer {
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  explanation?: string;
}

export interface Attempt {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeNumber;
  className: string;
  stationId: number;
  stationTitle: string;
  score: number;
  maxScore: number;
  isCompleted: boolean;
  answers: AttemptAnswer[];
  startedAt: string;
  completedAt?: string;
}

export interface StudentMessage {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeNumber;
  className: string;
  message: string;
  pledge: string;
  cardTheme: 'turquoise' | 'golden' | 'emerald' | 'royal';
  createdAt: string;
}

export interface SiteSettings {
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeQuotes: string[];
  videoPath: string;
  videoTitle: string;
  videoDescription: string;
  videoThumbnail?: string;
  videoRequired: boolean;
  logoUrl?: string;
  mascotVisible: boolean;
  schoolName: string;
  teacherName: string;
  adminPasswordHash?: string;
}

export interface StationMeta {
  id: number;
  title: string;
  shortName: string;
  badgeName: string;
  badgeDescription: string;
  color: string;
  bgColor: string;
  iconName: string;
  goal: string;
}

export interface TeacherAnalytics {
  totalStudents: number;
  totalAttempts: number;
  averageScore: number;
  gradeDistribution: Record<string, number>;
  stationCompletionCounts: Record<number, number>;
  mostMissedQuestions: {
    questionId: string;
    questionText: string;
    stationId: number;
    wrongCount: number;
    totalAnswers: number;
  }[];
}
