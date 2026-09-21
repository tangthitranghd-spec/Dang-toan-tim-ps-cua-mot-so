/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MATH_QUESTIONS } from './data/questions';
import { Question, UserAnswerRecord } from './types';
import { soundManager } from './utils/sound';
import { MathHeader } from './components/MathHeader';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { FeedbackBanner } from './components/FeedbackBanner';
import { NotebookModal } from './components/NotebookModal';
import { DraftPadModal } from './components/DraftPadModal';
import { ResultScreen } from './components/ResultScreen';
import { Sparkles, HelpCircle, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(MATH_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, UserAnswerRecord>>({});
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false);
  const [isDraftOpen, setIsDraftOpen] = useState<boolean>(false);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const totalPossibleScore = totalQuestions * 10;

  // Calculate current score
  const currentScore = Object.values(answers).reduce((sum, item) => sum + item.scoreEarned, 0);

  // Answer validation logic
  const handleAnswer = (userResponse: string | boolean | number) => {
    if (!currentQuestion) return;

    let isCorrect = false;

    if (currentQuestion.type === 'mcq') {
      isCorrect = String(userResponse).trim().toUpperCase() === String(currentQuestion.correctAnswer).trim().toUpperCase();
    } else if (currentQuestion.type === 'true_false') {
      isCorrect = Boolean(userResponse) === Boolean(currentQuestion.correctAnswer);
    } else {
      // Short answer or fill blank
      const cleanUser = String(userResponse).trim().toLowerCase().replace(/\s+/g, '');
      const cleanCorrect = String(currentQuestion.correctAnswer).trim().toLowerCase().replace(/\s+/g, '');

      // Check direct match
      if (cleanUser === cleanCorrect) {
        isCorrect = true;
      } else if (!isNaN(Number(cleanUser)) && !isNaN(Number(cleanCorrect)) && Number(cleanUser) === Number(cleanCorrect)) {
        // Numeric match
        isCorrect = true;
      } else if (currentQuestion.acceptableAnswers) {
        // Check acceptable answers list
        isCorrect = currentQuestion.acceptableAnswers.some((ans) => {
          const cleanAns = String(ans).trim().toLowerCase().replace(/\s+/g, '');
          return cleanUser === cleanAns;
        });
      }
    }

    // Play immediate audio feedback
    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const record: UserAnswerRecord = {
      questionId: currentQuestion.id,
      userAnswer: userResponse,
      isCorrect,
      scoreEarned: isCorrect ? 10 : 0,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: record,
    }));
  };

  // Next question or finish
  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  // Previous question (for review)
  const handlePrev = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Restart all 15 questions
  const handleRestartAll = () => {
    setQuestions(MATH_QUESTIONS);
    setAnswers({});
    setCurrentIndex(0);
    setIsGameOver(false);
  };

  // Retry only incorrect questions
  const handleRetryIncorrect = () => {
    const incorrectQuestions = questions.filter((q) => {
      const rec = answers[q.id];
      return !rec || !rec.isCorrect;
    });

    if (incorrectQuestions.length > 0) {
      setQuestions(incorrectQuestions);
      setAnswers({});
      setCurrentIndex(0);
      setIsGameOver(false);
    } else {
      handleRestartAll();
    }
  };

  const currentAnswerRecord = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isCurrentAnswered = currentAnswerRecord !== undefined;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-100/40 text-slate-800">
      {/* Top Header */}
      <MathHeader
        score={currentScore}
        totalPossibleScore={totalPossibleScore}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onOpenDraft={() => setIsDraftOpen(true)}
        onResetGame={handleRestartAll}
        currentQuestionIndex={currentIndex}
        totalQuestions={totalQuestions}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {isGameOver ? (
          /* Victory & Results Screen */
          <ResultScreen
            score={currentScore}
            totalPossibleScore={totalPossibleScore}
            answers={answers}
            questions={questions}
            onRestartAll={handleRestartAll}
            onRetryIncorrect={handleRetryIncorrect}
            onOpenNotebook={() => setIsNotebookOpen(true)}
          />
        ) : (
          /* Active Playing Screen */
          <div className="space-y-6">
            {/* Progress Step Bar */}
            <ProgressBar
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
              answers={answers}
              onSelectQuestion={(idx) => {
                soundManager.playClick();
                setCurrentIndex(idx);
              }}
              isAnswered={isCurrentAnswered}
            />

            {/* Current Question Card */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                existingAnswer={currentAnswerRecord}
                onAnswer={handleAnswer}
                questionNumber={currentIndex + 1}
              />
            )}

            {/* Immediate Feedback Banner (shown right after answering) */}
            {isCurrentAnswered && currentAnswerRecord && currentQuestion && (
              <FeedbackBanner
                isCorrect={currentAnswerRecord.isCorrect}
                question={currentQuestion}
                userAnswer={currentAnswerRecord.userAnswer}
                onNext={handleNext}
                isLastQuestion={isLastQuestion}
              />
            )}

            {/* Bottom Navigation controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                id="prev-question-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Nhận 10 điểm cho mỗi câu đúng</span>
              </div>

              {isCurrentAnswered ? (
                <button
                  id="nav-next-btn"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Xem kết quả' : 'Tiếp tục'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-24 text-right">
                  <span className="text-xs font-bold text-amber-700 italic">Chọn đáp án</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-amber-200/60 bg-white/60">
        <p className="font-semibold">
          Trò chơi học tập Toán 4 • Bài 63: Tìm phân số của một số • Bộ sách Kết nối tri thức với cuộc sống
        </p>
      </footer>

      {/* Sổ tay bí kíp Modal */}
      <NotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
      />

      {/* Bảng nháp điện tử Modal */}
      <DraftPadModal
        isOpen={isDraftOpen}
        onClose={() => setIsDraftOpen(false)}
      />
    </div>
  );
}
