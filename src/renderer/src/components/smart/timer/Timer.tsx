import CounterDisplay from '@renderer/components/ui/counter-display/CounterDisplay';
import React, { useEffect } from 'react';

interface TimerProps {
  inititalTime?: number; // seconds
  totalTime?: number; // seconds
  isPlaying?: boolean;
}

const Timer: React.FC<TimerProps> = ({ inititalTime = 0, totalTime = 60, isPlaying = false }) => {
  const [countdownTime, setCountdownTime] = React.useState<number>(inititalTime);

  const [timeInterval, setTimeInterval] = React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Start timer
      if (timeInterval) clearInterval(timeInterval);
      const interval = setInterval(() => {
        setCountdownTime((prev) => {
          const nextTime = prev - 1;
          if (nextTime === 0) {
            clearInterval(interval);
          }
          return nextTime;
        });
      }, 1000);
      setTimeInterval(interval);
    } else {
      // Stop timer
      if (timeInterval) clearInterval(timeInterval);
      setTimeInterval(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    setCountdownTime(inititalTime);
  }, [inititalTime]);

  return (
    <div className="w-40 h-40 rounded-md bg-gray-950">
      <div
        className={`w-full h-full ${isPlaying ? 'opacity-100' : 'opacity-50'} transition-all ease-in-out duration-500`}
      >
        <CounterDisplay time={countdownTime} totalTime={totalTime} />
      </div>
    </div>
  );
};

export default Timer;
