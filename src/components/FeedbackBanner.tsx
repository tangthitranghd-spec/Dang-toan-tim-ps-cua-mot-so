import React from 'react';
import { CheckCircle, XCircle, ArrowRight, Award, Lightbulb, BookOpen } from 'lucide-react';
import { Question } from '../types';
import { renderTextWithFractions } from './FractionDisplay';

interface FeedbackBannerProps {
  isCorrect: boolean;
  question: Question;
  userAnswer: string | boolean | number;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  question,
  userAnswer,
  onNext,
  isLastQuestion,
}) => {
  return (
    <div
      id="feedback-card"
      className={`rounded-3xl p-5 sm:p-6 border-3 shadow-lg transition-all animate-in zoom-in-95 duration-200 ${
        isCorrect
          ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300 shadow-emerald-100'
          : 'bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100/60 border-rose-300 shadow-rose-100'
      }`}
    >
      {/* Result Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          {isCorrect ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200">
              <CheckCircle className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <XCircle className="w-7 h-7" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-xl font-black tracking-tight ${
                  isCorrect ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {isCorrect ? '🎉 Tuyệt vời! Bạn trả lời chính xác!' : '💡 Chưa chính xác rồi, đừng buồn nhé!'}
              </h3>
              {isCorrect && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-200 text-emerald-900 shadow-2xs">
                  <Award className="w-3.5 h-3.5" /> +10 Điểm
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {isCorrect
                ? 'Em đã nắm rất chắc kiến thức tìm phân số của một số!'
                : 'Hãy quan sát kĩ lời giải từng bước bên dưới để ghi nhớ nhé!'}
            </p>
          </div>
        </div>

        {/* Action button to continue */}
        <button
          id="next-question-btn"
          onClick={onNext}
          className={`px-6 py-3.5 rounded-2xl font-black text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-base ${
            isCorrect
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 ring-2 ring-emerald-300'
              : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200 ring-2 ring-amber-300'
          }`}
        >
          <span>{isLastQuestion ? 'Xem Tổng Kết & Điểm Số 🏆' : 'Câu tiếp theo 👉'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Detailed Step-by-Step Explanation */}
      <div className="pt-4 space-y-4 text-slate-700">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Lời giải chi tiết chuẩn SGK Toán 4:</span>
        </div>

        {/* Applied Rule */}
        <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200 shadow-2xs text-sm">
          <span className="font-bold text-amber-900">📌 Quy tắc: </span>
          <span className="text-slate-700 font-medium">
            {renderTextWithFractions(question.explanation.rule)}
          </span>
        </div>

        {/* Calculation steps */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Các bước thực hiện:</p>
          {question.explanation.calculationSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1 font-medium">{renderTextWithFractions(step)}</div>
            </div>
          ))}
        </div>

        {/* Final Conclusion / Visual tip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-500/10 rounded-2xl p-3 border border-amber-300 text-sm">
          <div className="font-bold text-slate-800">
            👉 {renderTextWithFractions(question.explanation.resultSentence)}
          </div>
          {question.explanation.visualTip && (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-200/70 px-2.5 py-1 rounded-xl">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Mẹo: {question.explanation.visualTip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
