import { GameEngine, GameState, PlayerId } from '@cofy-tabletop/core-types';

export interface Position {
  x: number;
  y: number;
}

export interface ChineseCheckersBoard {
  cells: (PlayerId | null)[][]; // 5x5 grid
  players: [PlayerId, PlayerId];
}

export interface ChineseCheckersMove {
  from: Position;
  to: Position;
  playerId: PlayerId;
}

export class ChineseCheckersEngine implements GameEngine<ChineseCheckersBoard, ChineseCheckersMove> {
  private readonly BOARD_SIZE = 5;

  getInitialState(players: readonly PlayerId[]): GameState<ChineseCheckersBoard> {
    if (players.length !== 2) {
      throw new Error('Simplified Chinese Checkers requires exactly 2 players');
    }
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const p1 = players[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const p2 = players[1]!;

    const cells: (PlayerId | null)[][] = Array.from({ length: this.BOARD_SIZE }, () => Array(this.BOARD_SIZE).fill(null) as (PlayerId | null)[]);

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    // Player 1 in top-left corner (3 pieces)
    cells[0]![0] = p1;
    cells[0]![1] = p1;
    cells[1]![0] = p1;

    // Player 2 in bottom-right corner (3 pieces)
    cells[4]![4] = p2;
    cells[4]![3] = p2;
    cells[3]![4] = p2;
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    return {
      status: 'IN_PROGRESS',
      activeTurn: p1,
      board: {
        cells,
        players: [p1, p2],
      },
    };
  }

  isValidMove(
    state: GameState<ChineseCheckersBoard>,
    move: ChineseCheckersMove,
    playerId: PlayerId
  ): boolean {
    if (state.status !== 'IN_PROGRESS') return false;
    if (state.activeTurn !== playerId) return false;
    if (move.playerId !== playerId) return false;

    if (!this.isWithinBounds(move.from) || !this.isWithinBounds(move.to)) return false;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const piece = state.board.cells[move.from.y]![move.from.x];
    if (piece !== playerId) return false; // Must move own piece

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const target = state.board.cells[move.to.y]![move.to.x];
    if (target !== null) return false; // Target must be empty

    // Move logic: either 1 step adjacent, or 2 steps if jumping over exactly one piece
    const dx = Math.abs(move.to.x - move.from.x);
    const dy = Math.abs(move.to.y - move.from.y);

    const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    if (isAdjacent) return true;

    const isJump = (dx === 2 && dy === 0) || (dx === 0 && dy === 2);
    if (isJump) {
      const midX = (move.from.x + move.to.x) / 2;
      const midY = (move.from.y + move.to.y) / 2;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const jumpedPiece = state.board.cells[midY]![midX];
      if (jumpedPiece !== null) return true; // Can jump over any piece
    }

    return false;
  }

  applyMove(
    state: GameState<ChineseCheckersBoard>,
    move: ChineseCheckersMove
  ): GameState<ChineseCheckersBoard> {
    // Pure deep clone of the 2D array
    const newCells = state.board.cells.map(row => [...row]);

    // Apply the move
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newCells[move.from.y]![move.from.x] = null;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newCells[move.to.y]![move.to.x] = move.playerId;

    const nextPlayer = state.activeTurn === state.board.players[0] 
      ? state.board.players[1] 
      : state.board.players[0];

    const winner = this.checkWinner(newCells, state.board.players);

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

    return {
      ...state,
      board: newBoard,
      activeTurn: nextPlayer,
    };
  }

  private isWithinBounds(pos: Position): boolean {
    return pos.x >= 0 && pos.x < this.BOARD_SIZE && pos.y >= 0 && pos.y < this.BOARD_SIZE;
  }

  private checkWinner(cells: (PlayerId | null)[][], players: [PlayerId, PlayerId]): PlayerId | undefined {
    const p1 = players[0];
    const p2 = players[1];

    // P1 wins if their pieces occupy P2's starting area
    // P2's starting area: (4,4), (4,3), (3,4)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (cells[4]![4] === p1 && cells[4]![3] === p1 && cells[3]![4] === p1) {
      return p1;
    }

    // P2 wins if their pieces occupy P1's starting area
    // P1's starting area: (0,0), (0,1), (1,0)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (cells[0]![0] === p2 && cells[0]![1] === p2 && cells[1]![0] === p2) {
      return p2;
    }

    return undefined;
  }
}
