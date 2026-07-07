import React, { useState } from 'react';
import { useGameSocket } from './hooks/useGameSocket';
import { TicTacToeBoard } from './components/TicTacToeBoard';
import { ChineseCheckersBoard } from './components/ChineseCheckersBoard';
import { Gamepad2, Users, Loader2 } from 'lucide-react';

function App() {
  const { socketId, matchId, gameState, error, createMatch, joinMatch, sendMove } = useGameSocket();
  const [playerName, setPlayerName] = useState('');
  const [gameType, setGameType] = useState<'TIC_TAC_TOE' | 'CHINESE_CHECKERS'>('TIC_TAC_TOE');
  const [joinId, setJoinId] = useState('');

  const inLobby = !matchId && !gameState;
  const inWaitingRoom = matchId && !gameState?.state;
  const inGame = matchId && gameState?.state;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName) return;
    createMatch(gameType, playerName);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName || !joinId) return;
    joinMatch(joinId, playerName);
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      <header className="p-6 border-b border-white/10 flex items-center justify-between glass-panel rounded-none shadow-none bg-surface/50">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cofy Tabletop
          </h1>
        </div>
        {socketId && (
          <div className="flex items-center gap-2 text-sm text-textMuted bg-white/5 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Connected
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center p-6 md:p-12">
        {error && (
          <div className="mb-6 p-4 glass-panel border-red-500/50 bg-red-500/10 text-red-200 flex items-center gap-2 rounded-xl">
            <span>{error}</span>
          </div>
        )}

        {inLobby && (
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
            {/* Create Game Card */}
            <div className="glass-panel p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Create Game</h2>
              </div>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-textMuted mb-2">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-2">Game Type</label>
                  <select
                    value={gameType}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors text-white"
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === 'TIC_TAC_TOE' || v === 'CHINESE_CHECKERS') setGameType(v);
                    }}
                  >
                    <option value="TIC_TAC_TOE">Tic Tac Toe</option>
                    <option value="CHINESE_CHECKERS">Chinese Checkers (Simplified)</option>
                  </select>
                </div>
                <button type="submit" className="mt-2 w-full bg-primary hover:bg-primaryHover text-white font-medium py-3 rounded-lg transition-colors">
                  Create Room
                </button>
              </form>
            </div>

            {/* Join Game Card */}
            <div className="glass-panel p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold">Join Game</h2>
              </div>
              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-textMuted mb-2">Player Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-accent transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-textMuted mb-2">Room Code</label>
                  <input
                    type="text"
                    value={joinId}
                    onChange={e => setJoinId(e.target.value.toUpperCase())}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-accent transition-colors font-mono uppercase tracking-wider"
                    placeholder="e.g. A1B2C3"
                    required
                  />
                </div>
                <button type="submit" className="mt-2 w-full bg-accent hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition-colors">
                  Join Room
                </button>
              </form>
            </div>
          </div>
        )}

        {inWaitingRoom && (
          <div className="glass-panel p-12 flex flex-col items-center justify-center gap-6 max-w-md w-full text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Waiting for opponent</h2>
              <p className="text-textMuted">Share this room code with your friend:</p>
            </div>
            <div className="bg-black/30 border border-white/10 px-6 py-3 rounded-xl font-mono text-3xl tracking-widest text-primary font-bold">
              {matchId}
            </div>
          </div>
        )}

        {inGame && gameState && (
          <div className="w-full max-w-4xl flex flex-col items-center gap-8">
            <div className="glass-panel px-6 py-4 flex justify-between w-full max-w-2xl items-center">
              <div className="flex flex-col">
                <span className="text-xs text-textMuted uppercase tracking-wider">Player 1</span>
                <span className="font-semibold text-primary">{gameState.players[0]?.name}</span>
              </div>
              <div className="font-mono text-sm text-white/50 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                Room: {matchId}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-textMuted uppercase tracking-wider">Player 2</span>
                <span className="font-semibold text-accent">{gameState.players[1]?.name}</span>
              </div>
            </div>

            <div className="flex-1 w-full flex justify-center items-center">
              {gameState.gameType === 'TIC_TAC_TOE' && (
                <TicTacToeBoard
                  state={gameState.state}
                  playerId={socketId!}
                  onMove={sendMove}
                />
              )}
              {gameState.gameType === 'CHINESE_CHECKERS' && (
                <ChineseCheckersBoard
                  state={gameState.state}
                  playerId={socketId!}
                  onMove={sendMove}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;