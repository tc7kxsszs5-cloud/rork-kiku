import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

// Enhanced CORS configuration with security considerations
app.use("*", cors({
  origin: (origin) => {
    // Allow requests from allowed origins in production
    const allowedOrigins = [
      'https://d8v7u672uumlfpscvnbps.rork.live',
      'http://localhost:8081',
      'http://localhost:19006',
    ];
    
    // In development, allow localhost with any port
    if (process.env.NODE_ENV !== 'production') {
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        return origin;
      }
    }
    
    return allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0];
  },
  credentials: true,
  maxAge: 3600,
}));

// Enhanced tRPC server configuration with better error handling
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    onError: ({ error, path, type }) => {
      // Enhanced error logging with security considerations
      const errorInfo = {
        path,
        type,
        code: error.code,
        message: error.message,
        // Don't log full stack in production
        ...(process.env.NODE_ENV !== 'production' && { 
          stack: error.stack?.split('\n').slice(0, 3).join('\n') 
        }),
        timestamp: new Date().toISOString(),
      };

      console.error('[tRPC] Error:', errorInfo);

      // Don't expose internal errors to client in production
      if (process.env.NODE_ENV === 'production') {
        // Sanitize error message
        if (error.message.includes('password') || error.message.includes('token')) {
          error.message = 'Authentication error';
        }
      }
    },
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// Health check endpoint for monitoring
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime?.() || 0,
  });
});

// Enhanced error handler with security considerations
app.onError((err, c) => {
  // Sanitize error message to prevent information leakage
  let sanitizedMessage = 'Internal server error';
  
  // Only show detailed errors in development
  if (process.env.NODE_ENV !== 'production') {
    sanitizedMessage = err.message || sanitizedMessage;
  }

  // Log error securely (without sensitive data)
  const errorLog = {
    message: err.message,
    name: err.name,
    // Only log first line of stack to avoid exposing file paths
    stack: err.stack?.split('\n')[0] || 'No stack trace',
    timestamp: new Date().toISOString(),
    path: c.req.path,
    method: c.req.method,
  };

  console.error('[Hono] Error:', errorLog);
  
  // Don't expose tRPC internal errors differently
  if (c.req.path.startsWith('/api/trpc')) {
    return c.json(
      {
        error: {
          message: sanitizedMessage,
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      500
    );
  }
  
  return c.json(
    {
      error: {
        message: sanitizedMessage,
        status: 'error',
      },
    },
    500
  );
});

// Enhanced 404 handler
app.notFound((c) => {
  console.warn('[Hono] Not found:', c.req.path);
  
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

export default app;
