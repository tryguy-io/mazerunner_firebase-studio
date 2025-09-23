'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { generateDynamicSoundtrack } from '@/ai/flows/dynamic-soundtrack';
import type { Maze, Player, Position } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DynamicSoundtrackPlayerProps {
  timeRemaining: number;
  level: number;
  maze: Maze;
  player: Player | null;
  exit: Position | null;
}

// Debounce function
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function DynamicSoundtrackPlayer({
  timeRemaining,
  level,
  maze,
  player,
  exit,
}: DynamicSoundtrackPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const playerProgress = useMemo(() => {
    if (!player || !exit) return 0;
    const initialDist = Math.abs(exit.x - 0) + Math.abs(exit.y - 0);
    if (initialDist === 0) return 100;
    const currentDist = Math.abs(exit.x - player.x) + Math.abs(exit.y - player.y);
    return Math.round(100 * (1 - currentDist / initialDist));
  }, [player, exit]);

  const debouncedTime = useDebouncedValue(timeRemaining, 5000);
  const debouncedProgress = useDebouncedValue(playerProgress, 5000);
  const debouncedLevel = useDebouncedValue(level, 5000);


  useEffect(() => {
    let isMounted = true;
    async function fetchMusic() {
      try {
        const input = {
          timeRemaining: debouncedTime,
          level: debouncedLevel,
          playerProgress: debouncedProgress,
        };
        console.log('Generating soundtrack with input:', input);
        const { musicDataUri } = await generateDynamicSoundtrack(input);
        if (isMounted) {
          setAudioSrc(musicDataUri);
        }
      } catch (error) {
        console.error('Failed to generate soundtrack:', error);
        toast({
            variant: "destructive",
            title: "Soundtrack Error",
            description: "Could not generate background music.",
        });
      }
    }
    fetchMusic();

    return () => {
      isMounted = false;
    };
  }, [debouncedTime, debouncedLevel, debouncedProgress, toast]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const playAudio = async () => {
        if (audioSrc) {
          audio.src = audioSrc;
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (error) {
            console.log('Audio playback failed, user interaction may be required.');
            setIsPlaying(false);
          }
        }
      };
      playAudio();
    }
  }, [audioSrc]);
  
  // This effect will attempt to resume playback if it was interrupted
  useEffect(() => {
    const audio = audioRef.current;
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && audio && !audio.paused) {
            audio.play().catch(() => {});
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return <audio ref={audioRef} loop playsInline />;
}
