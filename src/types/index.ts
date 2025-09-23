export interface Cell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

export type Maze = Cell[][];

export interface Player {
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'start' | 'playing' | 'win' | 'game-over';

export interface GameState {
  gameState: GameStatus;
  level: number;
  score: number;
  time: number;
  maze: Maze | null;
  player: Player | null;
  exit: Position | null;
}
