export type PlayerId = string;

export interface Player {
  readonly id: PlayerId;
  readonly name: string;
  readonly isBot: boolean;
  connectionId?: string; // Nullable: if missing, the player is disconnected
}

export interface Match<TState> {
  readonly matchId: string;
  readonly gameType: 'TIC_TAC_TOE' | 'CHESS' | 'CUSTOM' | 'CHINESE_CHECKERS';
  readonly players: ReadonlyArray<Player>;
  state: TState; // This is the only place where the Lobby updates the overall state
}

export type GameStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

export interface GameState<TBoard> {
  readonly status: GameStatus;
  readonly activeTurn: PlayerId;
  readonly board: Readonly<TBoard>;
  readonly winner?: PlayerId;
}

export enum Difficulty {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

/**
 * Main contract for any game engine.
 * TBoard: The board data structure (e.g., 3x3 matrix).
 * TMove: The exact move structure validated by the engine itself.
 */
export interface GameEngine<TBoard, TMove> {
  getInitialState(players: ReadonlyArray<PlayerId>): GameState<TBoard>;
  isValidMove(state: GameState<TBoard>, move: TMove, playerId: PlayerId): boolean;
  // applyMove must be a pure function returning a new GameState object
  applyMove(state: GameState<TBoard>, move: TMove): GameState<TBoard>;
}

/**
 * Contract for AI Workers/Bots.
 */
export interface AIEngine<TBoard, TMove> {
  calculateNextMove(
    state: GameState<TBoard>,
    difficulty: Difficulty
  ): Promise<TMove>;
}
