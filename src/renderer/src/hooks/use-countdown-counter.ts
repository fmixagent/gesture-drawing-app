import { useState } from 'react';

const DEFAULT_COUNTDOWN_TIME = 60; // Default countdown time in seconds

type StopTimerOptions = {
  resetTimer?: boolean; // Whether to reset the timer to initial time after stopping
};

type UseCountdownTimerProps = {
  timer: number;
  isActive: boolean;
  countdownTime: number;
  setIsInfiniteLoop: (isInfinite: boolean) => void;
  setCountdownTime: (time: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: (stopTimerOptons?: StopTimerOptions) => void;
  resetTimer: (duration: number) => void;
  resetTimerWithoutStopping: (duration: number) => void;
};

const useCountdownTimer = (onTimerStart?: () => void): UseCountdownTimerProps => {
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);
  const [countdownTime, setCountdownTime] = useState(DEFAULT_COUNTDOWN_TIME);
  const [timer, setTimer] = useState(DEFAULT_COUNTDOWN_TIME);
  const [isActive, setIsActive] = useState(false);
  const [timerIinterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const decrementTimer = (): void => {
    if (!timer) return;
    setTimer((prev) => {
      if (prev <= 0) {
        if (isInfiniteLoop) {
          return countdownTime; // Reset to default if in infinite loop
        }
        return 0; // Stop at 0
      }
      if (prev === countdownTime && isInfiniteLoop) {
        onTimerStart?.(); // Trigger callback when timer starts
      }
      return prev - 1;
    });
  };

  const startTimer = (): void => {
    if (timerIinterval) clearInterval(timerIinterval);
    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);
    setTimerInterval(interval);
    setIsActive(true);
  };

  const pauseTimer = (): void => {
    if (timerIinterval) {
      clearInterval(timerIinterval);
      setTimerInterval(null);
      setIsActive(false);
    }
  };

  const stopTimer = (stopTimerOptons?: StopTimerOptions): void => {
    if (timerIinterval) {
      clearInterval(timerIinterval);
      setTimerInterval(null);
      setIsActive(false);
    }
    stopTimerOptons?.resetTimer && setTimer(countdownTime); // Reset to initial time or default
  };

  const resetTimer = (duration: number): void => {
    if (timerIinterval) {
      clearInterval(timerIinterval);
      setTimerInterval(null);
      setIsActive(false);
    }
    setCountdownTime(duration);
    setTimer(duration); // Reset to initial time or default
  };

  const resetTimerWithoutStopping = (duration: number): void => {
    setCountdownTime(duration);
    setTimer(duration); // Reset to initial time or default
  }

  return {
    timer,
    isActive,
    countdownTime,
    setIsInfiniteLoop,
    setCountdownTime,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    resetTimerWithoutStopping
  };
};

export default useCountdownTimer;
