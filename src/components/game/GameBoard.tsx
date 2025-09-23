'use client';

import { Maze, Player, Position } from '@/types';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  maze: Maze;
  player: Player;
  exit: Position;
}

export function GameBoard({ maze, player, exit }: GameBoardProps) {
  const width = maze[0].length;
  const height = maze.length;

  return (
    <div
      className="relative bg-background/50 border-2 border-primary/50 shadow-lg"
      style={{
        aspectRatio: `${width} / ${height}`,
        width: 'min(85vw, 85vh)',
      }}
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {maze.flat().map((cell) => (
          <div
            key={`${cell.x}-${cell.y}`}
            className={cn('relative', {
              'border-t-2 border-primary': cell.top,
              'border-r-2 border-primary': cell.right,
              'border-b-2 border-primary': cell.bottom,
              'border-l-2 border-primary': cell.left,
            })}
          />
        ))}
      </div>
      <div
        className="absolute bg-primary rounded-sm transition-all duration-150 ease-in-out"
        style={{
          width: `calc(100% / ${width} * 0.7)`,
          height: `calc(100% / ${height} * 0.7)`,
          top: `calc(100% / ${height} * ${player.y} + (100% / ${height} * 0.15))`,
          left: `calc(100% / ${width} * ${player.x} + (100% / ${width} * 0.15))`,
          boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))',
        }}
      />
      <div
        className="absolute bg-accent rounded-sm"
        style={{
          width: `calc(100% / ${width} * 0.7)`,
          height: `calc(100% / ${height} * 0.7)`,
          top: `calc(100% / ${height} * ${exit.y} + (100% / ${height} * 0.15))`,
          left: `calc(100% / ${width} * ${exit.x} + (100% / ${width} * 0.15))`,
          boxShadow: '0 0 15px hsl(var(--accent)), 0 0 25px hsl(var(--accent))',
        }}
      />
    </div>
  );
}
