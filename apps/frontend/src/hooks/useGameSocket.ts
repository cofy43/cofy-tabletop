import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Match } from '@cofy-tabletop/core-types';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function useGameSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<Match<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('matchCreated', (data: { matchId: string }) => {
      setMatchId(data.matchId);
      setError(null);
    });

    newSocket.on('gameStateUpdated', (match: Match<any>) => {
      setGameState(match);
      setMatchId(match.matchId);
      setError(null);
    });

    newSocket.on('error', (msg: string) => {
      setError(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createMatch = useCallback((gameType: 'TIC_TAC_TOE' | 'CHINESE_CHECKERS', playerName: string) => {
    socket?.emit('createMatch', { gameType, playerName });
  }, [socket]);

  const joinMatch = useCallback((targetMatchId: string, playerName: string) => {
    socket?.emit('joinMatch', { matchId: targetMatchId, playerName });
  }, [socket]);

  const sendMove = useCallback((move: unknown) => {
    if (matchId) {
      socket?.emit('playerMove', { matchId, move });
    }
  }, [socket, matchId]);

  return {
    socketId: socket?.id,
    matchId,
    gameState,
    error,
    createMatch,
    joinMatch,
    sendMove
  };
}
