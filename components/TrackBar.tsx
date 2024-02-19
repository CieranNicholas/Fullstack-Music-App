"use client";

import { useRef } from "react";

interface TrackBarProps {
  position: number;
  duration: number;
  onPositionChange: (position: number) => void;
}

const TrackBar: React.FC<TrackBarProps> = ({
  position,
  duration,
  onPositionChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = (position / duration) * 100;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!trackRef.current) {
      return;
    }

    const rect = trackRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element
    const width = rect.right - rect.left; // width of the element
    const newValue = (x / width) * duration;

    onPositionChange(newValue);
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Pad the minutes and seconds with leading zeros, if necessary
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  return (
    // <div
    //   className='relative bg-gray-300 h-2 cursor-pointer'
    //   onClick={handleClick}
    //   ref={trackRef}
    // >
    //   <div
    //     className='absolute left-0 top-0 h-2 bg-blue-500'
    //     style={{ width: `${percentage}%` }}
    //   />
    // </div>
    <div className='flex justify-between items-center gap-2'>
      <p className='pointer-events-none select-none text-xs'>
        {formatTime(position)}
      </p>
      <div
        className='bg-white/10 h-1 cursor-pointer w-full rounded group'
        onClick={handleClick}
        ref={trackRef}
      >
        <div
          className='h-full bg-white rounded  group-hover:bg-green-500'
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className='pointer-events-none select-none text-xs'>
        {formatTime(duration)}
      </p>
    </div>
  );
};

export default TrackBar;
