import { createServer } from 'http';
import { serve } from '@hono/node-server';
import app from './hono';
import { createWebSocketServer } from './services/websocket-server';

const PORT = Number(process.env.PORT) || 3000;

// Create HTTP server with Hono app
const handler = serve(app);
const server = createServer(handler);

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
