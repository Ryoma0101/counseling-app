import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  duration: number; // in seconds
  onFinish: () => void;
}

export function CountdownTimer({ duration, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    // Check if there's a stored end time
    const storedEndTime = localStorage.getItem('chatTimerEndTime');
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const now = Date.now();
      
      // If the end time is in the future, calculate remaining time
      if (endTime > now) {
        const remaining = Math.floor((endTime - now) / 1000);
        setTimeLeft(remaining);
      } else {
        // Timer has already expired
        setTimeLeft(0);
        setIsActive(false);
        onFinish();
      }
    } else {
      // No stored end time, set a new one
      const endTime = Date.now() + duration * 1000;
      localStorage.setItem('chatTimerEndTime', endTime.toString());
    }
  }, [duration, onFinish]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onFinish();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onFinish]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Percentage of time left for progress bar
  const percentLeft = (timeLeft / duration) * 100;
  
  return (
    <div className="flex items-center space-x-2">
      <Clock size={16} className="text-gray-500" />
      <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${percentLeft}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 font-medium">{formatTime(timeLeft)}</span>
    </div>
  );
}