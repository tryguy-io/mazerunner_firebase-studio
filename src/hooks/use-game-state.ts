'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
import { generateMaze } from '@/lib/maze';
import type { GameState, GameStatus, Maze, Player, Position } from '@/types';

const INITIAL_LEVEL = 1;
const MAZE_SIZE_INCREASE = 2;
const INITIAL_TIME_SECONDS = 60;
const TIME_DECREASE_PER_LEVEL = 3;

type Action =
  | { type: 'START_GAME' }
  | { type: 'RESTART_GAME' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'GAME_OVER' }
  | { type: 'TICK' }
  | { type: 'MOVE_PLAYER'; payload: { dx: number; dy: number } };

function getInitialState(): GameState {
  return {
    gameState: 'start',
    level: INITIAL_LEVEL,
    score: 0,
    time: INITIAL_TIME_SECONDS,
    maze: null,
    player: null,
    exit: null,
  };
}

function setupLevel(level: number, previousScore: number): Omit<GameState, 'gameState'> {
  const size = 5 + (level - 1) * MAZE_SIZE_INCREASE;
  const { maze, start, exit } = generateMaze(size, size);
  const time = Math.max(15, INITIAL_TIME_SECONDS - (level - 1) * TIME_DECREASE_PER_LEVEL);
  return {
    level,
    score: previousScore,
    time,
    maze,
    player: start,
    exit,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...getInitialState(),
        gameState: 'playing',
        ...setupLevel(INITIAL_LEVEL, 0),
      };
    case 'RESTART_GAME':
      return {
        ...getInitialState(),
        gameState: 'playing',
        ...setupLevel(INITIAL_LEVEL, 0),
      };
    case 'NEXT_LEVEL':
      const newLevel = state.level + 1;
      const newScore = state.score + state.time * 10;
      return {
        ...state,
        gameState: 'playing',
        ...setupLevel(newLevel, newScore),
      };
    case 'GAME_OVER':
      return { ...state, gameState: 'game-over' };
    case 'TICK':
      if (state.time <= 1) {
        return { ...state, time: 0, gameState: 'game-over' };
      }
      return { ...state, time: state.time - 1 };
    case 'MOVE_PLAYER':
      if (!state.player || !state.maze) return state;
      const { dx, dy } = action.payload;
      const { x, y } = state.player;
      const newPos = { x: x + dx, y: y + dy };
      const cell = state.maze[y][x];

      const canMove =
        (dx === 1 && !cell.right) ||
        (dx === -1 && !cell.left) ||
        (dy === 1 && !cell.bottom) ||
        (dy === -1 && !cell.top);

      if (canMove) {
        const isWin = newPos.x === state.exit?.x && newPos.y === state.exit?.y;
        return {
          ...state,
          player: newPos,
          gameState: isWin ? 'win' : state.gameState,
          score: isWin ? state.score + state.time * 10 : state.score,
        };
      }
      return state;
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const startGame = () => dispatch({ type: 'START_GAME' });
  const restartGame = () => dispatch({ type: 'RESTART_GAME' });
  const nextLevel = () => dispatch({ type: 'NEXT_LEVEL' });

  useEffect(() => {
    if (state.gameState !== 'playing') return;

    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameState !== 'playing') return;

      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') dy = -1;
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') dy = 1;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') dx = -1;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') dx = 1;

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        dispatch({ type: 'MOVE_PLAYER', payload: { dx, dy } });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameState]);

  return { ...state, startGame, restartGame, nextLevel };
}
