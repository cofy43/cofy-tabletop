import React, { useState } from 'react';
import type { GameState, PlayerId } from '@cofy-tabletop/core-types';
import clsx from 'clsx';

interface Position { x: number; y: number; }

interface ChineseCheckersBoardProps {
  state: GameState<{ cells: Array<Array<PlayerId | null>>; players: [PlayerId, PlayerId] }>;
  playerId: string;
  onMove: (move: { from: Position; to: Position; playerId: string }) => void;
}

export const ChineseCheckersBoard: React.FC<ChineseCheckersBoardProps> = ({ state, playerId, onMove }) => {
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const isMyTurn = state.activeTurn === playerId && state.status === 'IN_PROGRESS';
  const { cells, players } = state.board;

  const handleCellClick = (x: number, y: number) => {
    if (!isMyTurn) return;

    const piece = cells[y][x];

    if (piece === playerId) {
      // Select own piece
      setSelectedCell({ x, y });
    } else if (piece === null && selectedCell) {
      // Try to move to empty cell
      onMove({ from: selectedCell, to: { x, y }, playerId });
      setSelectedCell(null); // Optimistically deselect, if invalid the state won't update
    } else {
      setSelectedCell(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl font-medium">
        {state.status === 'FINISHED' ? (
          state.winner ? (
            <span className={state.winner === playerId ? "text-green-400" : "text-red-400"}>
              {state.winner === playerId ? "You won!" : "You lost!"}
            </span>
          ) : (
            <span className="text-yellow-400">Game Over</span>
          )
        ) : (
          isMyTurn ? <span className="text-accent animate-pulse">Your turn!</span> : <span className="text-textMuted">Waiting for opponent...</span>
        )}
      </div>

      <div className="p-6 glass-panel flex flex-col gap-2">
        {cells.map((row, y) => (
          <div key={y} className="flex gap-2 justify-center">
            {row.map((cell, x) => {
              const isSelected = selectedCell?.x === x && selectedCell?.y === y;
              const isP1 = cell === players[0];
              const isP2 = cell === players[1];

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className={clsx(
                    "w-12 h-12 rounded-full transition-all duration-300 shadow-md",
                    cell === null ? "bg-white/10 hover:bg-white/20" : "",
                    isP1 && "bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]",
                    isP2 && "bg-accent shadow-[0_0_15px_rgba(139,92,246,0.8)]",
                    isSelected && "ring-4 ring-white scale-110"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-sm text-textMuted max-w-md text-center">
        Goal: Move all your pieces to the opponent's starting corner. You can move one step adjacently or jump over one piece.
      </p>
    </div>
  );
};
