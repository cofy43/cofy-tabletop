import { GameEngine, GameState, PlayerId } from '@cofy-tabletop/core-types';

export interface TicTacToeBoard {
  cells: (PlayerId | null)[];
  players: [PlayerId, PlayerId];
}

export interface TicTacToeMove {
  position: number;
  playerId: PlayerId;
}

export class TicTacToeEngine implements GameEngine<TicTacToeBoard, TicTacToeMove> {
  getInitialState(players: readonly PlayerId[]): GameState<TicTacToeBoard> {
    if (players.length !== 2) {
      throw new Error('TicTacToe requires exactly 2 players');
    }
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstPlayer = players[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const secondPlayer = players[1]!;

    return {
      status: 'IN_PROGRESS',
      activeTurn: firstPlayer,
      board: {
        cells: Array(9).fill(null) as (PlayerId | null)[],
        players: [firstPlayer, secondPlayer],
      },
    };
  }

  isValidMove(
    state: GameState<TicTacToeBoard>,
    move: TicTacToeMove,
    playerId: PlayerId
  ): boolean {
    if (state.status !== 'IN_PROGRESS') return false;
    if (state.activeTurn !== playerId) return false;
    if (move.playerId !== playerId) return false;
    if (move.position < 0 || move.position > 8) return false;
    if (state.board.cells[move.position] !== null) return false;
    
    return true;
  }

  applyMove(
    state: GameState<TicTacToeBoard>,
    move: TicTacToeMove
  ): GameState<TicTacToeBoard> {
    // Pure function: we do not mutate state
    const newCells = [...state.board.cells];
    newCells[move.position] = move.playerId;

    const winner = this.checkWinner(newCells);
    const isDraw = !winner && newCells.every((cell) => cell !== null);

    const nextPlayer = state.activeTurn === state.board.players[0] 
      ? state.board.players[1] 
      : state.board.players[0];

    const newBoard = {
      ...state.board,
      cells: newCells,
    };

    if (winner) {
      return {
        ...state,
        board: newBoard,
        status: 'FINISHED',
        winner,
      };
    }

    if (isDraw) {
      return {
        ...state,
        board: newBoard,
        status: 'FINISHED',
      };
    }

    return {
      ...state,
      board: newBoard,
      activeTurn: nextPlayer,
    };
  }

  private checkWinner(cells: (PlayerId | null)[]): PlayerId | undefined {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of winningCombinations) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const playerA = cells[a!];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const playerB = cells[b!];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const playerC = cells[c!];
      
      if (playerA && playerA === playerB && playerA === playerC) {
        return playerA;
      }
    }

    return undefined;
  }
}
