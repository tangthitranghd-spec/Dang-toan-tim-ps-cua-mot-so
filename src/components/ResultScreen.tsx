import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, CheckCircle2, XCircle, Award, ChevronDown, ChevronUp, BookOpen, Flame, ShieldCheck } from 'lucide-react';
import { Question, UserAnswerRecord } from '../types';
import { soundManager } from '../utils/sound';
import { renderTextWithFractions } from './FractionDisplay';

interface ResultScreenProps {
  score: number;
  totalPossibleScore: number;
  answers: Record<number, UserAnswerRecord>;
  questions: Question[];
  onRestartAll: () => void;
  onRetryIncorrect: () => void;
  onOpenNotebook: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalPossibleScore,
  answers,
  questions,
  onRestartAll,
  onRetryIncorrect,
  onOpenNotebook,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;

  // Breakdown by level
  const mediumQuestions = questions.filter((q) => q.level === 'medium');
  const hardQuestions = questions.filter((q) => q.level === 'hard');

  const mediumCorrect = mediumQuestions.filter((q) => answers[q.id]?.isCorrect).length;
  const hardCorrect = hardQuestions.filter((q) => answers[q.id]?.isCorrect).length;

  // Title assignment
  let titleBadge = {
    title: 'Thần Đồng Toán Học Xuất Sắc 🏆',
    description: 'Tuyệt đỉnh! Em đã xuất sắc chinh phục trọn vẹn thử thách Tìm phân số của một số!',
    color: 'from-amber-400 to-yellow-500',
  };

  if (score < 80) {
    titleBadge = {
      title: 'Bạn Nhỏ Kiên Trì 💪',
      description: 'Em đã rất cố gắng! Hãy mở Sổ tay bí kíp để ôn tập thêm và thử lại nhé!',
      color: 'from-blue-400 to-indigo-500',
    };
  } else if (score < 120) {
    titleBadge = {
      title: 'Chiến Binh Toán Học Chăm Chỉ 🚀',
      description: 'Làm rất tốt! Em đã nắm vững các bài toán cơ bản, chỉ cần cẩn thận hơn ở bài toán 2 bước!',
      color: 'from-emerald-400 to-teal-500',
    };
  } else if (score < 150) {
    titleBadge = {
      title: 'Nhà Thám Hiểm Cừ Khôi 🌟',
      description: 'Thành tích rất ấn tượng! Em đã giải quyết thành thạo hầu hết các thử thách khó!',
      color: 'from-purple-400 to-pink-500',
    };
  }

  // Play fanfare and shoot confetti on mount
  useEffect(() => {
    soundManager.playFanfare();
    if (score >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }
  }, [score]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Hero Victory Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-100/70 blur-3xl -z-0 pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 shadow-lg shadow-amber-200">
            <Trophy className="w-16 h-16 fill-amber-100" />
          </div>

          <div>
            <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-300">
              Hoàn Thành Hành Trình 15 Câu
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              {titleBadge.title}
            </h2>
            <p className="text-slate-600 font-semibold max-w-lg mx-auto mt-1 text-sm sm:text-base">
              {titleBadge.description}
            </p>
          </div>

          {/* Big Score Display */}
          <div className="inline-flex items-baseline space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 px-8 py-3.5 rounded-3xl shadow-xs">
            <span className="text-4xl sm:text-5xl font-black text-amber-900">{score}</span>
            <span className="text-xl font-bold text-amber-600">/ {totalPossibleScore} điểm</span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
              <span className="text-xs font-bold text-emerald-700">Câu trả lời đúng</span>
              <p className="text-2xl font-black text-emerald-800">{correctCount} / {totalQuestions}</p>
            </div>
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3">
              <span className="text-xs font-bold text-rose-700">Câu chưa đúng</span>
              <p className="text-2xl font-black text-rose-800">{incorrectCount} / {totalQuestions}</p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Mức 1 (Cơ bản)
              </div>
              <p className="text-2xl font-black text-blue-800">{mediumCorrect} / {mediumQuestions.length}</p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-700">
                <Flame className="w-3.5 h-3.5" /> Mức 2 (Nâng cao)
              </div>
              <p className="text-2xl font-black text-orange-800">{hardCorrect} / {hardQuestions.length}</p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              id="restart-game-btn"
              onClick={() => {
                soundManager.playClick();
                onRestartAll();
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all text-base"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Chơi lại từ đầu (15 câu)</span>
            </button>

            {incorrectCount > 0 && (
              <button
                id="retry-incorrect-btn"
                onClick={() => {
                  soundManager.playClick();
                  onRetryIncorrect();
                }}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all text-base"
              >
                <Award className="w-5 h-5" />
                <span>Luyện lại {incorrectCount} câu sai</span>
              </button>
            )}

            <button
              id="result-open-notebook-btn"
              onClick={() => {
                soundManager.playClick();
                onOpenNotebook();
              }}
              className="px-6 py-3 bg-blue-50 hover:bg-blue-100 active:scale-95 border-2 border-blue-300 text-blue-800 font-black rounded-2xl shadow-xs flex items-center gap-2 cursor-pointer transition-all text-base"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Ôn tập Sổ tay bí kíp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Question Review List */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Xem Lại Chi Tiết 15 Thử Thách & Lời Giải
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Bấm vào từng câu để xem lời giải chi tiết và cách nhẩm nhanh chuẩn SGK
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            10 điểm / câu
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const isCorrect = ans?.isCorrect;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                id={`review-item-${q.id}`}
                className={`rounded-2xl border-2 transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-rose-200 bg-rose-50/40'
                }`}
              >
                {/* Question Summary Bar */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                        isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {q.levelLabel} • {q.typeLabel}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">
                        {renderTextWithFractions(q.title, 'sm')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> +10đ
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" /> 0đ
                        </>
                      )}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-200/80 space-y-3 text-sm">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <p className="font-extrabold text-slate-900">
                        {renderTextWithFractions(q.title, 'md')}
                      </p>
                      {q.statement && (
                        <p className="text-slate-700 italic bg-amber-50 p-2 rounded-lg border border-amber-200">
                          "{renderTextWithFractions(q.statement, 'md')}"
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2 rounded-lg bg-slate-100">
                          <span className="font-bold text-slate-600">Câu trả lời của em: </span>
                          <span className={`font-black ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {typeof ans?.userAnswer === 'boolean'
                              ? ans.userAnswer
                                ? 'ĐÚNG'
                                : 'SAI'
                              : String(ans?.userAnswer ?? 'Chưa trả lời')}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-900">
                          <span className="font-bold">Đáp án chuẩn xác: </span>
                          <span className="font-black">
                            {typeof q.correctAnswer === 'boolean'
                              ? q.correctAnswer
                                ? 'ĐÚNG'
                                : 'SAI'
                              : String(q.correctAnswer)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step by step */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <p className="font-bold text-amber-800 text-xs uppercase tracking-wider">
                        Lời giải từng bước:
                      </p>
                      {q.explanation.calculationSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-slate-700 text-xs flex items-start gap-1.5">
                          <span className="font-bold text-amber-600">{sIdx + 1}.</span>
                          <span>{renderTextWithFractions(step, 'sm')}</span>
                        </div>
                      ))}
                      <p className="text-xs font-bold text-emerald-800 pt-1 border-t border-slate-100">
                        👉 {renderTextWithFractions(q.explanation.resultSentence, 'sm')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
