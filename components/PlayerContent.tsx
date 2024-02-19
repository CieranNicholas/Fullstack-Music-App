"use client";

import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useEffect, useState } from "react";
// @ts-ignore
import useSound from "use-sound";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import Trackbar from "./TrackBar";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  volume: number;
  setVolume: (volume: number) => void;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl,
  volume,
  setVolume,
}) => {
  const player = usePlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) return player.setId(player.ids[0]);

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);

    player.setId(previousSong);
  };

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [position, setPosition] = useState(0);

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      setIsPlaying(true);
    },
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
      if (intervalId) clearInterval(intervalId);
    },
    onpause: () => {
      setIsPlaying(false);
      if (intervalId) clearInterval(intervalId);
    },
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();
    const id = setInterval(() => {
      if (sound) {
        setPosition(sound?.seek());
      }
    }, 1000);
    setIntervalId(id);
    return () => sound?.unload();
  }, [sound]);

  useEffect(() => {
    console.log("position", position);
  }, [position]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className='flex h-full items-center relative'>
      <div className='flex w-full justify-start'>
        <div className='flex items-center gap-x-4'>
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className='flex md:hidden col-auto w-full justify-end items-center gap-4'>
        <AiFillStepBackward
          size={30}
          onClick={onPlayPrevious}
          className='text-neutral-400 cursor-pointer hover:text-white transition'
        />
        <div
          onClick={handlePlay}
          className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'
        >
          <Icon size={30} className='text-black' />
        </div>
        <AiFillStepForward
          size={30}
          onClick={onPlayNext}
          className='text-neutral-400 cursor-pointer hover:text-white transition'
        />
      </div>
      <div className='hidden h-full md:flex md:flex-col w-full'>
        <div className="className='hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <AiFillStepBackward
            size={20}
            onClick={onPlayPrevious}
            className='text-neutral-400 cursor-pointer hover:text-white transition'
          />
          <div
            className='flex items-center justify-center h-7 w-7 rounded-full bg-white p-1 cursor-pointer'
            onClick={handlePlay}
          >
            <Icon size={30} className='text-black' />
          </div>
          <AiFillStepForward
            size={20}
            onClick={onPlayNext}
            className='text-neutral-400 cursor-pointer hover:text-white transition'
          />
        </div>
        <Trackbar
          position={position}
          duration={sound ? sound.duration() : 0}
          onPositionChange={(position) => {
            if (sound) {
              sound.seek(position);
            }
          }}
        />
      </div>
      <div className='hidden md:flex w-full justify-end pr-2'>
        <div className='flex items-center gap-x-2 w-[120px]'>
          <VolumeIcon
            onClick={toggleMute}
            className='cursor-pointer'
            size={20}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
      {/* Mobile Trackbar */}
      <Trackbar
        mobile
        position={position}
        duration={sound ? sound.duration() : 0}
        onPositionChange={(position) => {
          if (sound) {
            sound.seek(position);
          }
        }}
      />
    </div>
  );
};

export default PlayerContent;
