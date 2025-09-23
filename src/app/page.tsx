'use client';

import { GameBoard } from '@/components/game/GameBoard';
import { GameUI } from '@/components/game/GameUI';
import { GameOverlay } from '@/components/game/GameOverlay';
import { useGameState } from '@/hooks/use-game-state';
import { DynamicSoundtrackPlayer } from '@/components/game/DynamicSoundtrackPlayer';

export default function Home() {
  const {
    gameState,
    level,
    score,
    time,
    maze,
    player,
    exit,
    startGame,
    restartGame,
    nextLevel,
  } = useGameState();

  const isOverlayVisible =
    gameState === 'start' || gameState === 'win' || gameState === 'game-over';

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background font-headline p-4 overflow-hidden">
      {isOverlayVisible ? (
        <GameOverlay
          gameState={gameState}
          score={score}
          onStart={startGame}
          onRestart={restartGame}
          onNextLevel={nextLevel}
        />
      ) : (
        <>
          <GameUI level={level} score={score} time={time} />
          {maze && player && exit && (
            <GameBoard maze={maze} player={player} exit={exit} />
          )}
        </>
      )}
      {gameState === 'playing' && maze && (
        <DynamicSoundtrackPlayer
          timeRemaining={time}
          level={level}
          maze={maze}
          player={player}
          exit={exit}
        />
      )}
    </main>
  );
}
