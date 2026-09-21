import React from 'react';
import { Check, X, ShieldCheck, Flame } from 'lucide-react';
import { UserAnswerRecord } from '../types';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  answers: Record<number, UserAnswerRecord>;
  onSelectQuestion?: (index: number) => void;
  isAnswered: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  answers,
  onSelectQuestion,
  isAnswered,
}) => {
  const currentQNumber = currentIndex + 1;
  const isMedium = currentQNumber <= 8;

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs space-y-3">
      {/* Top row: Status info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-500 text-white rounded-xl font-black text-sm shadow-xs">
            Câu {currentQNumber}/{totalQuestions}
          </span>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${
              isMedium
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-orange-50 text-orange-800 border-orange-200'
            }`}
          >
            {isMedium ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mức độ 1: Cơ bản (1-8)</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Mức độ 2: Nâng cao (9-15)</span>
              </>
            )}
          </div>
        </div>

        {/* Completion rate */}
        <div className="text-xs font-bold text-slate-500">
          Đã làm:{' '}
          <span className="text-slate-800 font-extrabold">{Object.keys(answers).length}</span>/{totalQuestions} câu
        </div>
      </div>

      {/* Progress Dots / Steps */}
      <div className="relative">
        {/* Connection track */}
        <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full -z-0" />

        <div className="grid grid-cols-15 gap-1 sm:gap-1.5 relative z-10">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const qId = idx + 1;
            const ans = answers[qId];
            const isActive = idx === currentIndex;
            const isAnsweredItem = ans !== undefined;
            const isCorrect = ans?.isCorrect;

            let dotStyle = 'bg-white border-2 border-slate-300 text-slate-500';

            if (isActive) {
              dotStyle =
                'bg-amber-400 border-2 border-amber-600 text-slate-900 ring-3 ring-amber-200 font-black scale-110 shadow-sm';
            } else if (isAnsweredItem) {
              if (isCorrect) {
                dotStyle = 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-2xs font-bold';
              } else {
                dotStyle = 'bg-rose-500 border-2 border-rose-600 text-white shadow-2xs font-bold';
              }
            }

            return (
              <button
                key={idx}
                id={`progress-dot-${idx + 1}`}
                onClick={() => {
                  // If question is answered, allow jumping to view explanation/review
                  if (onSelectQuestion && (isAnsweredItem || idx <= Object.keys(answers).length)) {
                    onSelectQuestion(idx);
                  }
                }}
                disabled={!isAnsweredItem && idx > Object.keys(answers).length}
                className={`w-full aspect-square rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-all ${dotStyle} ${
                  isAnsweredItem || idx <= Object.keys(answers).length
                    ? 'cursor-pointer hover:opacity-90'
                    : 'cursor-not-allowed opacity-60'
                }`}
                title={`Câu ${idx + 1}${
                  isAnsweredItem ? (isCorrect ? ' (Đúng +10đ)' : ' (Chưa đúng)') : ''
                }`}
              >
                {isAnsweredItem && !isActive ? (
                  isCorrect ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <X className="w-3 h-3 stroke-[3]" />
                  )
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Milestone divider info */}
      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1 pt-1">
        <span className="flex items-center gap-1 text-blue-600">
          <span>● Câu 1-8: Cơ bản</span>
        </span>
        <span className="flex items-center gap-1 text-orange-600">
          <span>● Câu 9-15: Nâng cao & Vận dụng</span>
        </span>
      </div>
    </div>
  );
};
