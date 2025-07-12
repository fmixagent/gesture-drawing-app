import React from 'react';

interface CircularProgressBarProps {
  percentage: number; // percentage of completion
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full h-full ">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="10" opacity="1" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#10b981"
          strokeWidth="10"
          opacity="1"
          strokeDasharray={Math.PI * 90} // circumference of the circle
          strokeDashoffset={(Math.PI * 90 * (100 - percentage)) / 100} // offset based on percentage (hidden part)
          transform="rotate(-90 50 50)" // start at top
          strokeLinecap="round" // rounded ends
        />
      </svg>
    </div>
  );
};

export default CircularProgressBar;
