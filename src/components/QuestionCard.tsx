import React, { useState, useEffect } from 'react';
import { Question, UserAnswerRecord } from '../types';
import { renderTextWithFractions } from './FractionDisplay';
import { soundManager } from '../utils/sound';
import { Send, Check, X, Sparkles, HelpCircle, Delete } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  existingAnswer?: UserAnswerRecord;
  onAnswer: (answer: string | boolean | number) => void;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  existingAnswer,
  onAnswer,
  questionNumber,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Sync state when question changes or when viewing answered question
  useEffect(() => {
    if (existingAnswer) {
      if (typeof existingAnswer.userAnswer === 'string') {
        setSelectedOption(existingAnswer.userAnswer);
        setInputValue(existingAnswer.userAnswer);
      } else {
        setInputValue(String(existingAnswer.userAnswer));
      }
    } else {
      setInputValue('');
      setSelectedOption(null);
    }
  }, [question.id, existingAnswer]);

  const isAnswered = existingAnswer !== undefined;

  // Handle MCQ selection
  const handleSelectMCQ = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    soundManager.playClick();
    onAnswer(optionId);
  };

  // Handle True / False selection
  const handleSelectTrueFalse = (val: boolean) => {
    if (isAnswered) return;
    soundManager.playClick();
    onAnswer(val);
  };

  // Handle Short Answer / Fill Blank submission
  const handleSubmitInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !inputValue.trim()) return;
    soundManager.playClick();
    onAnswer(inputValue.trim());
  };

  // Virtual numeric keypad click
  const handleKeypadClick = (val: string) => {
    if (isAnswered) return;
    soundManager.playClick();
    if (val === 'backspace') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (val === 'clear') {
      setInputValue('');
    } else {
      setInputValue((prev) => (prev.length < 10 ? prev + val : prev));
    }
  };

  return (
    <div
      id={`question-card-${question.id}`}
      className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-amber-200 shadow-md space-y-6"
    >
      {/* Question Header & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
        <div className="flex items-center space-x-2">
          <span className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
            {questionNumber}
          </span>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700">
              {question.typeLabel}
            </span>
            {question.storyContext && (
              <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <span>{question.illustrationEmoji || '✨'}</span>
                <span>{question.storyContext}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Thử thách 10 điểm</span>
        </div>
      </div>

      {/* Question Title & Content */}
      <div className="space-y-4">
        <div className="text-lg sm:text-xl font-extrabold text-slate-800 leading-relaxed">
          {renderTextWithFractions(question.title, 'lg')}
        </div>

        {/* Highlighted Statement (for True/False or Fill Blank questions) */}
        {question.statement && (
          <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-4 sm:p-5 text-center">
            <p className="text-base sm:text-lg font-bold text-slate-800">
              "{renderTextWithFractions(question.statement, 'lg')}"
            </p>
          </div>
        )}
      </div>

      {/* Answer Input Areas according to type */}

      {/* 1. MCQ TYPE */}
      {question.type === 'mcq' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {question.options.map((option) => {
            const isSelected = isAnswered
              ? existingAnswer.userAnswer === option.id
              : selectedOption === option.id;
            const isCorrectAnswer = isAnswered && question.correctAnswer === option.id;
            const isWrongChoice = isAnswered && isSelected && !isCorrectAnswer;

            let cardStyle =
              'bg-slate-50 hover:bg-amber-50/60 border-2 border-slate-200 hover:border-amber-400 text-slate-800';

            if (isAnswered) {
              if (isCorrectAnswer) {
                cardStyle = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-900 shadow-xs font-bold';
              } else if (isWrongChoice) {
                cardStyle = 'bg-rose-50 border-3 border-rose-500 text-rose-900 line-through opacity-90';
              } else {
                cardStyle = 'bg-slate-50/60 border-2 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'bg-amber-100 border-3 border-amber-500 text-amber-950 font-bold';
            }

            return (
              <button
                key={option.id}
                id={`mcq-option-${option.id}`}
                onClick={() => handleSelectMCQ(option.id)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all ${cardStyle} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-98'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 ${
                      isCorrectAnswer
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : isWrongChoice
                        ? 'bg-rose-500 text-white border-rose-600'
                        : isSelected
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="text-base sm:text-lg font-bold">
                    {renderTextWithFractions(option.text, 'md')}
                  </span>
                </div>

                {/* State Icons */}
                {isAnswered && (
                  <div>
                    {isCorrectAnswer && (
                      <span className="p-1 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                    {isWrongChoice && (
                      <span className="p-1 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <X className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. TRUE / FALSE TYPE */}
      {question.type === 'true_false' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[
            { value: true, label: 'ĐÚNG', sub: 'Chính xác!', color: 'emerald' },
            { value: false, label: 'SAI', sub: 'Không chính xác!', color: 'rose' },
          ].map((item) => {
            const isSelected = isAnswered && existingAnswer.userAnswer === item.value;
            const isCorrect = isAnswered && question.correctAnswer === item.value;
            const isWrongChoice = isAnswered && isSelected && !isCorrect;

            let btnStyle =
              item.value
                ? 'bg-emerald-50 hover:bg-emerald-100/70 border-2 border-emerald-300 text-emerald-800'
                : 'bg-rose-50 hover:bg-rose-100/70 border-2 border-rose-300 text-rose-800';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-3 border-emerald-600 shadow-md font-black';
              } else if (isWrongChoice) {
                btnStyle = 'bg-rose-500 text-white border-3 border-rose-600 shadow-md font-black';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={String(item.value)}
                id={`tf-option-${item.value ? 'true' : 'false'}`}
                onClick={() => handleSelectTrueFalse(item.value)}
                disabled={isAnswered}
                className={`p-5 rounded-2xl flex flex-col items-center justify-center transition-all ${btnStyle} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-95 shadow-xs'
                }`}
              >
                <span className="text-2xl font-black tracking-wide">{item.label}</span>
                <span className="text-xs font-semibold opacity-80 mt-1">{item.sub}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. SHORT ANSWER & FILL BLANK TYPE */}
      {(question.type === 'short_answer' || question.type === 'fill_blank') && (
        <div className="space-y-4 pt-1">
          <form onSubmit={handleSubmitInput} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border-2 border-slate-300 rounded-2xl focus-within:border-amber-500 focus-within:bg-amber-50/30 transition-all">
              {question.fillPrefix && (
                <span className="text-base sm:text-lg font-bold text-slate-700">
                  {renderTextWithFractions(question.fillPrefix, 'md')}
                </span>
              )}

              <input
                id="math-answer-input"
                type="text"
                value={inputValue}
                onChange={(e) => !isAnswered && setInputValue(e.target.value)}
                disabled={isAnswered}
                placeholder={question.placeholder || 'Nhập số vào đây...'}
                className="flex-1 min-w-[140px] px-3 py-2 bg-white text-lg sm:text-xl font-black text-slate-800 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-center"
                autoComplete="off"
              />

              {question.fillSuffix && (
                <span className="text-base sm:text-lg font-bold text-slate-700">
                  {renderTextWithFractions(question.fillSuffix, 'md')}
                </span>
              )}

              {!isAnswered && (
                <button
                  type="submit"
                  id="submit-answer-btn"
                  disabled={!inputValue.trim()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Trả lời</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Virtual Keypad for easy tapping on touchscreens or mouse */}
          {!isAnswered && (
            <div className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-500">Bàn phím số nhanh:</span>
                <span className="text-[11px] text-slate-400">Có thể gõ trực tiếp từ bàn phím</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadClick(digit)}
                    className="p-2.5 bg-white hover:bg-amber-50 active:bg-amber-100 border border-slate-300 rounded-xl font-black text-base text-slate-800 shadow-2xs transition-all cursor-pointer text-center"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleKeypadClick('backspace')}
                  className="p-2.5 bg-amber-100 hover:bg-amber-200 active:scale-95 border border-amber-300 rounded-xl font-black text-xs text-amber-900 shadow-2xs transition-all cursor-pointer flex items-center justify-center col-span-1"
                  title="Xóa ký tự vừa gõ"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadClick('clear')}
                  className="p-2.5 bg-rose-100 hover:bg-rose-200 active:scale-95 border border-rose-300 rounded-xl font-black text-xs text-rose-900 shadow-2xs transition-all cursor-pointer text-center col-span-1"
                  title="Xóa hết"
                >
                  C
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
