import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { FractionDisplay } from './FractionDisplay';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="notebook-modal"
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-300 flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white p-5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide">Sổ Tay Bí Kíp Toán 4</h2>
              <p className="text-amber-100 text-xs font-medium">Bộ sách Kết nối tri thức với cuộc sống</p>
            </div>
          </div>
          <button
            id="close-notebook-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Đóng sổ tay"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-700">
          {/* Quy tắc trọng tâm */}
          <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-3 text-amber-800 font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>1. Quy tắc cốt lõi (SGK Toán 4 - Bài 63)</span>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-xs border border-amber-100 mb-3">
              <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed text-center">
                Muốn tìm phân số của một số, ta lấy <span className="text-amber-600 underline decoration-2">số đó</span> nhân với <span className="text-blue-600 underline decoration-2">phân số</span>.
              </p>
            </div>
            <p className="text-sm text-slate-600 italic text-center">
              Công thức tổng quát: Muốn tìm <FractionDisplay numerator="m" denominator="n" size="sm" /> của số <span className="font-bold">a</span>, ta tính:
            </p>
            <div className="mt-2 text-center text-lg font-bold text-slate-800 bg-amber-100/60 py-2 rounded-lg">
              a × <FractionDisplay numerator="m" denominator="n" /> = (a × m) : n = (a : n) × m
            </div>
          </div>

          {/* Ví dụ mẫu trực quan */}
          <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold text-lg">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>2. Ví dụ minh họa thực tế</span>
            </div>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-900 mb-1">
                  Ví dụ 1: Một rổ có 12 quả cam. Tìm <FractionDisplay numerator="2" denominator="3" size="sm" /> số cam trong rổ?
                </p>
                <p className="text-slate-600 pl-3 border-l-2 border-blue-300">
                  <FractionDisplay numerator="2" denominator="3" size="sm" /> số cam trong rổ là:{' '}
                  <span className="font-bold text-blue-700">12 × 2/3 = 8 (quả)</span>
                  <br />
                  <span className="text-xs text-slate-500">Mẹo tính nhẩm: 12 chia 3 được 4, rồi lấy 4 nhân 2 bằng 8 quả.</span>
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-900 mb-1">
                  Ví dụ 2: Lớp học có 35 bạn, trong đó <FractionDisplay numerator="3" denominator="5" size="sm" /> là nữ. Tìm số bạn nữ?
                </p>
                <p className="text-slate-600 pl-3 border-l-2 border-blue-300">
                  Số học sinh nữ của lớp là:{' '}
                  <span className="font-bold text-blue-700">35 × 3/5 = 21 (bạn)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Mẹo làm bài nâng cao */}
          <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-lg">
              <Lightbulb className="w-5 h-5 text-emerald-600" />
              <span>3. Chú ý quan trọng khi làm bài khó</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
              <li>
                <span className="font-bold text-emerald-900">Bài toán 2 bước (Tìm số còn lại):</span> Khi đề bài hỏi số đồ vật/số tiền <em>"còn lại"</em>, trước hết tìm số đã dùng, sau đó lấy số ban đầu trừ đi số đã dùng.
              </li>
              <li>
                <span className="font-bold text-emerald-900">Bài toán hình học:</span> Khi đề cho chiều dài và chiều rộng bằng <FractionDisplay numerator="m" denominator="n" size="sm" /> chiều dài, cần tìm chiều rộng trước rồi mới tính diện tích hoặc chu vi.
              </li>
              <li>
                <span className="font-bold text-emerald-900">Đổi đơn vị đo:</span> Hãy chú ý đơn vị đo (ví dụ: mét sang cm, giờ sang phút, kg sang g) trước khi thực hiện phép tính nếu đề bài yêu cầu đơn vị khác.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="understand-notebook-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Đã hiểu bí kíp! Sẵn sàng làm bài ✨
          </button>
        </div>
      </div>
    </div>
  );
};
