import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Edit2, Eraser, Undo2 } from 'lucide-react';

interface DraftPadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DraftPadModal: React.FC<DraftPadModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#1e293b');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on client bounding rect
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Save initial state
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), currentState]);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    const cleared = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev, cleared]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop();
    const prevState = nextHistory[nextHistory.length - 1];
    ctx.putImageData(prevState, 0, 0);
    setHistory(nextHistory);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="draft-pad-modal"
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col border-4 border-emerald-400 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bảng Nháp Toán Học</h2>
              <p className="text-xs text-emerald-100">Đặt tính và nhẩm phép chia, nhân trực tiếp tại đây</p>
            </div>
          </div>
          <button
            id="close-draft-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
            title="Đóng bảng nháp"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Tools & Colors */}
          <div className="flex items-center space-x-2">
            <button
              id="tool-pen-btn"
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                tool === 'pen'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Edit2 className="w-4 h-4" /> Bút viết
            </button>
            <button
              id="tool-eraser-btn"
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                tool === 'eraser'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eraser className="w-4 h-4" /> Cục tẩy
            </button>

            {/* Colors */}
            <div className="flex items-center space-x-1.5 ml-2 pl-2 border-l border-slate-300">
              {[
                { label: 'Đen', hex: '#1e293b' },
                { label: 'Xanh', hex: '#2563eb' },
                { label: 'Đỏ', hex: '#dc2626' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    setTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c.hex && tool === 'pen'
                      ? 'scale-125 border-emerald-500 ring-2 ring-emerald-300'
                      : 'border-white'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="undo-btn"
              onClick={undo}
              disabled={history.length <= 1}
              className="p-2 rounded-xl bg-white text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Hoàn tác"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              id="clear-draft-btn"
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Xóa trắng bảng"
            >
              <Trash2 className="w-4 h-4" /> Xóa bảng
            </button>
          </div>
        </div>

        {/* Canvas Area with grid background to mimic quad-ruled notebook paper */}
        <div className="flex-1 relative bg-white overflow-hidden cursor-crosshair">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>💡 Mẹo: Nháp ra phân số hoặc phép tính chia rồi nhân trước khi bấm chọn đáp án.</span>
          <button
            id="done-draft-btn"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            Xong nháp
          </button>
        </div>
      </div>
    </div>
  );
};
