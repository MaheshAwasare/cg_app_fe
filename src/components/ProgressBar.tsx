import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime: number;
  totalTime: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, totalTime }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const percentage = Math.min((currentTime / totalTime) * 100, 100);
    setProgress(percentage);
  }, [currentTime, totalTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-1 text-sm text-primary-200">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalTime)}</span>
      </div>
      <div className="w-full h-2 bg-primary-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;