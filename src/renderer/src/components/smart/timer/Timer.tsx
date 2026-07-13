import CircularProgressBar from '@renderer/components/ui/circular-progress-bar/CircularProgressBar';
import CounterDisplay from '@renderer/components/ui/counter-display/CounterDisplay';
import React, { useEffect } from 'react';

interface TimerProps {
  inititalTime?: number; // seconds
  totalTime?: number; // seconds
  isPlaying?: boolean;
  onStartedTimer?: () => void; // Callback when timer ends
}

const Timer: React.FC<TimerProps> = ({
  inititalTime = 0,
  totalTime = 60,
  isPlaying = false,
  onStartedTimer,
}) => {
  const [countdownTime, setCountdownTime] = React.useState<number>(inititalTime);
  const [timeInterval, setTimeInterval] = React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCountdownTime(inititalTime);
  }, [inititalTime]);

  const decrementTime = (): void => {
    setCountdownTime((prev) => {
      console.log('Current countdown time:', prev, Date.now());
      if (prev === inititalTime) onStartedTimer?.();
      if (prev <= 0) {
        return inititalTime; // Reset to initial time if it goes below 0
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      // Start timer
      if (timeInterval) clearInterval(timeInterval);
      setTimeInterval(
        setInterval(() => {
          decrementTime();
        }, 1000)
      );
    } else {
      // Stop timer
      if (timeInterval) clearInterval(timeInterval);
      setTimeInterval(null);
    }

    return () => {
      if (timeInterval) clearInterval(timeInterval);
      setTimeInterval(null);
    };
  }, [isPlaying]);

  return (
    <div className="relative w-40 h-40 rounded-md">
      <div
        className={`w-full h-full ${isPlaying ? 'opacity-100' : 'opacity-50'} transition-all ease-in-out duration-500`}
      >
        <CounterDisplay time={countdownTime} totalTime={totalTime} />
        <div className="absolute inset-0 flex justify-center items-center p-3">
          <CircularProgressBar percentage={(totalTime - countdownTime / totalTime) * 100} />
        </div>
      </div>
    </div>
  );
};

export default Timer;
