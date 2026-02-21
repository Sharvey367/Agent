import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer(onTick, onComplete) {
  const [remaining, setRemaining] = useState(null); // seconds remaining, null = inactive
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const totalRef = useRef(0);

  const start = useCallback((minutes) => {
    if (minutes <= 0) {
      // Infinite mode
      setRemaining(null);
      setIsRunning(true);
      totalRef.current = 0;
      return;
    }
    const seconds = minutes * 60;
    totalRef.current = seconds;
    setRemaining(seconds);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setRemaining(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null) {
          // Infinite mode — just tick for fade tracking
          if (onTick) onTick(null, totalRef.current);
          return null;
        }
        const next = prev - 1;
        if (onTick) onTick(next, totalRef.current);
        if (next <= 0) {
          if (onComplete) onComplete();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onTick, onComplete]);

  const elapsed = remaining !== null && totalRef.current > 0
    ? totalRef.current - remaining
    : null;

  return { remaining, isRunning, elapsed, start, stop, totalSeconds: totalRef.current };
}

export function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '\u221E';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
