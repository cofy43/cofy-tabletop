import { ChineseCheckersEngine } from './index';

describe('ChineseCheckersEngine', () => {
  let engine: ChineseCheckersEngine;

  beforeEach(() => {
    engine = new ChineseCheckersEngine();
  });

  test('should return correct initial state', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);

    expect(state.status).toBe('IN_PROGRESS');
    expect(state.activeTurn).toBe('p1');
    expect(state.board.cells).toHaveLength(5);

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    expect(state.board.cells[0]![0]).toBe('p1');
    expect(state.board.cells[4]![4]).toBe('p2');
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  });

  test('applyMove should return a new state without mutating the old one', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);
    const move = { from: { x: 1, y: 0 }, to: { x: 2, y: 0 }, playerId: 'p1' };

    const newState = engine.applyMove(state, move);

    // Inmutabilidad
    expect(newState).not.toBe(state);
    expect(newState.board).not.toBe(state.board);

    // Solución sin usar '!' (non-null assertion)
    const cell = newState.board.cells[0];
    expect(cell).toBeDefined();
    expect(cell).toBe('p1'); // Verifica el valor directamente

    expect(newState.activeTurn).toBe('p2');

    const originalCell = state.board.cells[0];
    expect(originalCell).toBeNull(); // Verifica que el original sigue siendo null
  });

  test('applyMove should return a new state without mutating the old one', () => {
    const players = ['p1', 'p2'];
    const state = engine.getInitialState(players);
    const move = { from: { x: 1, y: 0 }, to: { x: 2, y: 0 }, playerId: 'p1' };

    const newState = engine.applyMove(state, move);

    // Check immutability
    expect(newState).not.toBe(state);
    expect(newState.board).not.toBe(state.board);
    expect(newState.board.cells).not.toBe(state.board.cells);
    expect(newState.board.cells[0]).not.toBe(state.board.cells[0]);

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    // Check actual result
    expect(newState.board.cells[0]![2]).toBe('p1');
    expect(newState.activeTurn).toBe('p2');
    expect(state.board.cells[0]![2]).toBeNull(); // original untouched
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  });
});
