import { Server, Socket } from 'socket.io';
import { Match, Player } from '@cofy-tabletop/core-types';
import { TicTacToeEngine, TicTacToeMove } from '../games/tic-tac-toe';
import { ChineseCheckersEngine, ChineseCheckersMove } from '../games/chinese-checkers';

type SupportedGame = 'TIC_TAC_TOE' | 'CHESS' | 'CUSTOM' | 'CHINESE_CHECKERS';

export class GameLobby {
  private readonly io: Server;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly matches = new Map<string, Match<any>>();
  private readonly ticTacToe = new TicTacToeEngine();
  private readonly chineseCheckers = new ChineseCheckersEngine();

  constructor(io: Server) {
    this.io = io;
    this.setupListeners();
  }

  private setupListeners(): void {
    this.io.on('connection', (socket: Socket) => {
      console.info(`[Lobby] Player connected: ${socket.id}`);

      socket.on('createMatch', ({ gameType, playerName }: { gameType: SupportedGame, playerName: string }) => {
        const matchId = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const host: Player = {
          id: socket.id, // Using socket ID as player ID for MVP
          name: playerName,
          isBot: false,
          connectionId: socket.id,
        };

        const match: Match<unknown> = {
          matchId,
          gameType,
          players: [host],
          state: null, // Will be initialized when game starts
        };

        this.matches.set(matchId, match);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        socket.join(matchId);
        
        socket.emit('matchCreated', { matchId });
      });

      socket.on('joinMatch', ({ matchId, playerName }: { matchId: string, playerName: string }) => {
        const match = this.matches.get(matchId);
        if (!match) {
          socket.emit('error', 'Match not found');
          return;
        }

        if (match.players.length >= 2) {
          socket.emit('error', 'Match is full');
          return;
        }

        const guest: Player = {
          id: socket.id,
          name: playerName,
          isBot: false,
          connectionId: socket.id,
        };

        const newMatch = { ...match, players: [...match.players, guest] };
        this.matches.set(matchId, newMatch);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        socket.join(matchId);

        // Start game
        if (newMatch.gameType === 'TIC_TAC_TOE') {
          newMatch.state = this.ticTacToe.getInitialState(newMatch.players.map(p => p.id));
        } else if (newMatch.gameType === 'CHINESE_CHECKERS') {
          newMatch.state = this.chineseCheckers.getInitialState(newMatch.players.map(p => p.id));
        }

        this.io.to(matchId).emit('gameStateUpdated', newMatch);
      });

      socket.on('playerMove', ({ matchId, move }: { matchId: string, move: unknown }) => {
        const match = this.matches.get(matchId);
        if (!match?.state) return;

        if (match.gameType === 'TIC_TAC_TOE') {
          const state = match.state as ReturnType<TicTacToeEngine['getInitialState']>;
          const tttMove = move as TicTacToeMove;
          
          if (this.ticTacToe.isValidMove(state, tttMove, socket.id)) {
            match.state = this.ticTacToe.applyMove(state, tttMove);
            this.io.to(matchId).emit('gameStateUpdated', match);
          }
        } else if (match.gameType === 'CHINESE_CHECKERS') {
          const state = match.state as ReturnType<ChineseCheckersEngine['getInitialState']>;
          const ccMove = move as ChineseCheckersMove;

          if (this.chineseCheckers.isValidMove(state, ccMove, socket.id)) {
            match.state = this.chineseCheckers.applyMove(state, ccMove);
            this.io.to(matchId).emit('gameStateUpdated', match);
          }
        }
      });

      socket.on('disconnect', () => {
        console.info(`[Lobby] Player disconnected: ${socket.id}`);
        // For MVP, we won't implement the shadow bot, just log it.
      });
    });
  }
}
