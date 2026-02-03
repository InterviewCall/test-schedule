import React from 'react';

type CircularProgressProps = {
  percentage?: number;
  size?: number;
  color: string;   
  bgColor?: string;
};

const CircularProgressBar: React.FC<CircularProgressProps> = ({
  percentage = 0,
  size = 78,
  color,     
  bgColor = '#d1d5db',   
}) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {/* Percentage text */}
      <span
            className="absolute text-lg font-semibold"
            style={{ color }}
        >
        {progress}%
      </span>
    </div>
  );
};

export default CircularProgressBar;
