"use client";

import { useRef } from "react";

interface TrackBarProps {
  position: number;
  duration: number;
  onPositionChange: (position: number) => void;
  mobile?: boolean;
}

const TrackBar: React.FC<TrackBarProps> = ({
  position,
  duration,
  onPositionChange,
  mobile,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = (position / duration) * 100;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!trackRef.current) {
      return;
    }

    const rect = trackRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.right - rect.left;
    const newValue = (x / width) * duration;

    onPositionChange(newValue);
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  }

  return (
    <>
      {mobile ? (
        <div className='flex justify-between items-center gap-2 absolute bottom-[-.5rem] left-0 w-full md:hidden'>
          <div
            className='bg-white/10 h-1 cursor-pointer w-full rounded group'
            onClick={handleClick}
            ref={trackRef}
          >
            <div
              className='h-full bg-white rounded  group-hover:bg-brand'
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ) : (
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
              className='h-full bg-white rounded  group-hover:bg-brand'
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className='pointer-events-none select-none text-xs'>
            {formatTime(duration)}
          </p>
        </div>
      )}
    </>
  );
};

export default TrackBar;
