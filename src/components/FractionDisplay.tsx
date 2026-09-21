import React from 'react';

interface FractionDisplayProps {
  numerator: string | number;
  denominator: string | number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  numerator,
  denominator,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-sm min-w-[1.25rem]',
    md: 'text-base min-w-[1.5rem]',
    lg: 'text-xl font-bold min-w-[1.8rem]',
  };

  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-bold select-none text-slate-800 ${className}`}
    >
      <span className={`px-0.5 border-b-2 border-slate-700 leading-none pb-0.5 ${sizeClasses[size]}`}>
        {numerator}
      </span>
      <span className={`px-0.5 leading-none pt-0.5 ${sizeClasses[size]}`}>
        {denominator}
      </span>
    </span>
  );
};

// Helper để chuyển chuỗi có định dạng a/b thành phân số hiển thị đẹp
export const renderTextWithFractions = (text: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  // Regex tìm kiếm mẫu như 2/3, 3/5, 4/7, 5/6, v.v.
  const regex = /(\b\d+)\/(\d+\b)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const num = match[1];
    const den = match[2];
    parts.push(
      <FractionDisplay
        key={`frac-${match.index}`}
        numerator={num}
        denominator={den}
        size={size}
      />
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};
