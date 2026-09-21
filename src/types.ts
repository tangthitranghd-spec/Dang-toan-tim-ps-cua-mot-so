export type QuestionType = 'mcq' | 'short_answer' | 'true_false' | 'fill_blank';

export type DifficultyLevel = 'medium' | 'hard';

export interface Question {
  id: number;
  level: DifficultyLevel; // 'medium' (Trung bình) or 'hard' (Khó)
  levelLabel: string;
  type: QuestionType;
  typeLabel: string;
  title: string;
  storyContext?: string; // Tình huống thực tế (rổ cam, trang sách, lớp học...)
  illustrationEmoji?: string;
  
  // MCQ options
  options?: {
    id: string;
    text: string;
    fractionDisplay?: { num: number; den: number };
  }[];
  
  // For True/False questions
  statement?: string;
  
  // For fill blank questions
  fillPrefix?: string;
  fillSuffix?: string;
  placeholder?: string;

  // Correct answer identifier or numerical value or boolean
  correctAnswer: string | boolean | number;
  acceptableAnswers?: (string | number)[]; // Cho câu trả lời ngắn/điền khuyết nếu học sinh nhập có dấu phẩy hoặc khoảng trắng

  // Detailed step-by-step explanation
  explanation: {
    rule: string;
    calculationSteps: string[];
    resultSentence: string;
    visualTip?: string;
  };
}

export interface UserAnswerRecord {
  questionId: number;
  userAnswer: string | boolean | number;
  isCorrect: boolean;
  scoreEarned: number;
}
