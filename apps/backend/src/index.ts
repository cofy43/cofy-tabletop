import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = Number(process.env['PORT']) || 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.info(`[Socket] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.info(`[Socket] Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.info(`🚀 Cofy Tabletop server running on port ${String(PORT)}`);
});

export { io, httpServer };
