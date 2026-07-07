import React from 'react';
import type { GameState, PlayerId } from '@cofy-tabletop/core-types';
import clsx from 'clsx';

interface TicTacToeBoardProps {
  state: GameState<{ cells: Array<PlayerId | null>; players: [PlayerId, PlayerId] }>;
  playerId: string;
  onMove: (move: { position: number, playerId: string }) => void;
}

export const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ state, playerId, onMove }) => {
  const { cells } = state.board;
  const isMyTurn = state.activeTurn === playerId && state.status === 'IN_PROGRESS';

  const handleCellClick = (index: number) => {
    if (isMyTurn && !cells[index]) {
      onMove({ position: index, playerId });
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
            <span className="text-yellow-400">It's a draw!</span>
          )
        ) : (
          isMyTurn ? <span className="text-primary animate-pulse">Your turn!</span> : <span className="text-textMuted">Waiting for opponent...</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 glass-panel">
        {cells.map((cell, index) => {
          const isP1 = cell === state.board.players[0];
          const isP2 = cell === state.board.players[1];
          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || state.status !== 'IN_PROGRESS' || state.activeTurn !== playerId}
              className={clsx(
                "w-24 h-24 sm:w-32 sm:h-32 rounded-xl text-5xl font-bold flex items-center justify-center transition-all duration-300",
                !cell && isMyTurn ? "hover:bg-white/10 cursor-pointer" : "cursor-default",
                cell ? "bg-white/5" : "bg-white/5",
                isP1 && "text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                isP2 && "text-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              )}
            >
              {isP1 ? "X" : isP2 ? "O" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};
