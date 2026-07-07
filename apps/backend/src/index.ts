import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameLobby } from './lobby';

const PORT = Number(process.env['PORT']) || 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const lobby = new GameLobby(io);

httpServer.listen(PORT, () => {
  console.info(`🚀 Cofy Tabletop server running on port ${String(PORT)}`);
});

export { io, httpServer, lobby };
