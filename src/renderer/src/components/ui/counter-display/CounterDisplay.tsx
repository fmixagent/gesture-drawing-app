import React from 'react';

interface CounterDisplayProps {
  time: number; // seconds
  totalTime: number; // seconds
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ time }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <div className="w-full h-full text-gray-200 flex justify-center items-center text-3xl ">
      {formatTime(time)}
    </div>
  );
};

export default CounterDisplay;
