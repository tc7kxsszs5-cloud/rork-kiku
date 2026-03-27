import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";
import type { Context as HonoContext } from "hono";

const app = new Hono();

// Secure CORS configuration
app.use("*", cors({
  origin: (origin) => {
    // Allow requests from known origins
    const allowedOrigins = [
      'https://d8v7u672uumlfpscvnbps.rork.live',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083',
      'http://localhost:19006',
      'exp://localhost:8081',
    ];

    // Всегда разрешаем любой localhost (для разработки против прод-API)
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return origin;
    }

    return allowedOrigins.includes(origin || '') ? origin : null;
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  credentials: true,
}));

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`[tRPC] Error on ${path}:`, error);
    },
  })
);

app.get("/", (c: HonoContext) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.onError((err: Error, c: HonoContext) => {
  // Log full error for debugging (but don't expose to client)
  console.error('[Hono] Error:', {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
  });
  
  // Don't expose internal error details to clients
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = isDevelopment 
    ? err.message 
    : 'An internal error occurred. Please try again later.';
  
  if (c.req.path.startsWith('/api/trpc')) {
    return c.text(`Error: ${errorMessage}`, 500);
  }
  
  return c.json(
    {
      error: {
        message: errorMessage,
        status: 'error',
      },
    },
    500
  );
});

app.notFound((c: HonoContext) => {
  return c.json(
    {
      error: {
        message: 'Not Found',
        status: 'error',
        path: c.req.path,
      },
    },
    404
  );
});

// Vercel serverless function handler
export default app;

// Export handler for Vercel
export const handler = app.fetch;
