import { createServer } from 'http';
import { serve } from '@hono/node-server';
import app from './hono';
import { createWebSocketServer } from './services/websocket-server';

const PORT = Number(process.env.PORT) || 3000;

// Create HTTP server with proper typing
const server = createServer();

// Add request handler from Hono
server.on('request', serve(app) as any);

// Initialize WebSocket server
createWebSocketServer(server);

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║   Kids Messenger Backend Server Started       ║
╠═══════════════════════════════════════════════╣
║   HTTP API:     http://localhost:${PORT}       ║
║   WebSocket:    ws://localhost:${PORT}/ws     ║
║   tRPC:         http://localhost:${PORT}/api/trpc ║
╚═══════════════════════════════════════════════╝
  `);
});

export { server };
