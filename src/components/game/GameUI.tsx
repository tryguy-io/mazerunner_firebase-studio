interface GameUIProps {
  level: number;
  score: number;
  time: number;
}

export function GameUI({ level, score, time }: GameUIProps) {
  return (
    <div className="w-full max-w-4xl mb-4 p-2 rounded-lg border-2 border-primary/20 bg-background/30 flex justify-between items-center text-primary font-headline text-lg md:text-2xl shadow-lg">
      <div className="flex-1 text-left">
        <span className="text-foreground/70">Level: </span>
        <span className="font-bold">{level}</span>
      </div>
      <div className="flex-1 text-center">
        <span className="text-foreground/70">Time: </span>
        <span className="font-bold">{time}</span>
      </div>
      <div className="flex-1 text-right">
        <span className="text-foreground/70">Score: </span>
        <span className="font-bold">{score}</span>
      </div>
    </div>
  );
}
