'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStatus } from '@/types';

interface GameOverlayProps {
  gameState: GameStatus;
  score: number;
  onStart: () => void;
  onRestart: () => void;
  onNextLevel: () => void;
}

export function GameOverlay({
  gameState,
  score,
  onStart,
  onRestart,
  onNextLevel,
}: GameOverlayProps) {
  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return {
          title: 'Labyrinth Escape',
          buttonText: 'Start Game',
          action: onStart,
          description: 'Reach the green exit before time runs out. Use WASD or Arrow Keys to move.'
        };
      case 'win':
        return {
          title: 'You Win!',
          buttonText: 'Next Level',
          action: onNextLevel,
          description: `Your score: ${score}`
        };
      case 'game-over':
        return {
          title: 'Game Over',
          buttonText: 'Restart',
          action: onRestart,
          description: `Final score: ${score}`
        };
      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="w-full max-w-md text-center border-primary/50 shadow-2xl shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-4xl lg:text-5xl font-bold text-primary tracking-widest">
            {content.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-foreground/80 text-lg">{content.description}</p>
          <Button
            onClick={content.action}
            size="lg"
            className="w-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-shadow duration-300"
            style={{ textShadow: '0 0 5px hsl(var(--primary))' }}
          >
            {content.buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
