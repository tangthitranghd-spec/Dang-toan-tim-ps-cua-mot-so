import React from 'react';
import { Volume2, VolumeX, BookOpen, Edit3, RotateCcw, Trophy, Star, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MathHeaderProps {
  score: number;
  totalPossibleScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotebook: () => void;
  onOpenDraft: () => void;
  onResetGame: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const MathHeader: React.FC<MathHeaderProps> = ({
  score,
  totalPossibleScore,
  soundEnabled,
  onToggleSound,
  onOpenNotebook,
  onOpenDraft,
  onResetGame,
  currentQuestionIndex,
  totalQuestions,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b-2 border-amber-200 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-200 text-2xl select-none">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                Toán 4 • Kết nối tri thức
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              TÌM PHÂN SỐ CỦA MỘT SỐ
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h1>
          </div>
        </div>

        {/* Center: Score Card Badge */}
        <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 px-4 py-1.5 rounded-2xl shadow-xs">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Trophy className="w-4 h-4 text-white fill-white" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Điểm số</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl sm:text-2xl font-black text-amber-900 leading-none">{score}</span>
              <span className="text-xs font-bold text-amber-600">/{totalPossibleScore}</span>
            </div>
          </div>
        </div>

        {/* Right Tools Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Bảng nháp */}
          <button
            id="open-draft-pad-btn"
            onClick={() => {
              soundManager.playClick();
              onOpenDraft();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Mở bảng nháp đặt tính"
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Bảng nháp</span>
          </button>

          {/* Sổ tay bí kíp SGK */}
          <button
            id="open-notebook-btn"
            onClick={() => {
              soundManager.playClick();
              onOpenNotebook();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-xs font-extrabold shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Xem sổ tay ghi nhớ kiến thức"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Sổ tay bí kíp</span>
          </button>

          {/* Âm thanh */}
          <button
            id="toggle-sound-btn"
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            className={`p-2 rounded-xl border transition-all active:scale-95 cursor-pointer ${
              soundEnabled
                ? 'bg-amber-100/70 border-amber-300 text-amber-800'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-700" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Chơi lại */}
          <button
            id="reset-game-header-btn"
            onClick={() => {
              if (window.confirm('Bạn có muốn bắt đầu lại hành trình từ câu số 1 không?')) {
                soundManager.playClick();
                onResetGame();
              }
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-600 transition-all active:scale-95 cursor-pointer"
            title="Bắt đầu lại"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
