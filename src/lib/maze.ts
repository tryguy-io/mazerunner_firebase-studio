import type { Maze, Cell, Position } from '@/types';

export function generateMaze(width: number, height: number): { maze: Maze, start: Position, exit: Position } {
  const maze: Maze = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );

  const stack: Cell[] = [];
  const start: Position = { x: 0, y: 0 };
  const exit: Position = { x: width - 1, y: height - 1 };
  
  let current = maze[start.y][start.x];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop()!;
    const neighbors = getUnvisitedNeighbors(current, maze, width, height);

    if (neighbors.length > 0) {
      stack.push(current);
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, neighbor);
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  return { maze, start, exit };
}

function getUnvisitedNeighbors(cell: Cell, maze: Maze, width: number, height: number): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

  // Top
  if (y > 0 && !maze[y - 1][x].visited) {
    neighbors.push(maze[y - 1][x]);
  }
  // Right
  if (x < width - 1 && !maze[y][x + 1].visited) {
    neighbors.push(maze[y][x + 1]);
  }
  // Bottom
  if (y < height - 1 && !maze[y + 1][x].visited) {
    neighbors.push(maze[y + 1][x]);
  }
  // Left
  if (x > 0 && !maze[y][x - 1].visited) {
    neighbors.push(maze[y][x - 1]);
  }

  return neighbors;
}

function removeWall(a: Cell, b: Cell) {
  const dx = a.x - b.x;
  if (dx === 1) {
    a.left = false;
    b.right = false;
  } else if (dx === -1) {
    a.right = false;
    b.left = false;
  }

  const dy = a.y - b.y;
  if (dy === 1) {
    a.top = false;
    b.bottom = false;
  } else if (dy === -1) {
    a.bottom = false;
    b.top = false;
  }
}
