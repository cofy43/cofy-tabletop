import { TicTacToeEngine } from './index';

describe('TicTacToeEngine', () => {
  let engine: TicTacToeEngine;

  beforeEach(() => {
    engine = new TicTacToeEngine();
  });

  test('should return correct initial state', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);

    expect(state.status).toBe('IN_PROGRESS');
    expect(state.activeTurn).toBe('p1');
    expect(state.board.cells).toHaveLength(9);
    expect(state.board.cells.every(c => c === null)).toBe(true);
    expect(state.board.players).toEqual(['p1', 'p2']);
  });

  test('isValidMove should validate moves correctly', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);

    // Valid move
    expect(engine.isValidMove(state, { position: 0, playerId: 'p1' }, 'p1')).toBe(true);

    // Invalid: wrong player turn
    expect(engine.isValidMove(state, { position: 0, playerId: 'p2' }, 'p2')).toBe(false);

    // Invalid: out of bounds
    expect(engine.isValidMove(state, { position: 9, playerId: 'p1' }, 'p1')).toBe(false);
  });

  test('applyMove should return a new state without mutating the old one', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);
    const move = { position: 4, playerId: 'p1' };
    
    const newState = engine.applyMove(state, move);

    // Check immutability
    expect(newState).not.toBe(state);
    expect(newState.board).not.toBe(state.board);
    expect(newState.board.cells).not.toBe(state.board.cells);

    // Check actual result
    expect(newState.board.cells[4]).toBe('p1');
    expect(newState.activeTurn).toBe('p2');
    expect(state.board.cells[4]).toBeNull(); // original untouched
  });

  test('should detect a win and finish the game', () => {
    const players = ['p1', 'p2'];
    let state = engine.getInitialState(players);
    
    // p1: 0, p2: 3, p1: 1, p2: 4, p1: 2
    state = engine.applyMove(state, { position: 0, playerId: 'p1' });
    state = engine.applyMove(state, { position: 3, playerId: 'p2' });
    state = engine.applyMove(state, { position: 1, playerId: 'p1' });
    state = engine.applyMove(state, { position: 4, playerId: 'p2' });
    state = engine.applyMove(state, { position: 2, playerId: 'p1' });

    expect(state.status).toBe('FINISHED');
    expect(state.winner).toBe('p1');
  });
});
