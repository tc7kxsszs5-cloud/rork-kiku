import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

const trpcHandler = trpcServer({
  router: appRouter,
  createContext,
  onError: ({ error, path }) => {
    console.error(`[tRPC] Error on ${path}:`, error);
  },
});

app.use("/api/trpc", trpcHandler);
app.use("/api/trpc/*", trpcHandler);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api", (c) => {
  return c.json({ status: "ok", message: "API endpoint" });
});

app.get("/api/trpc", (c) => {
  return c.json({ status: "ok", message: "tRPC endpoint - use POST for queries" });
});

app.onError((err, c) => {
  console.error('[Hono] Error:', err);
  
  if (c.req.path.startsWith('/api/trpc')) {
    return c.text(`Error: ${err.message}`, 500);
  }
  
  return c.json(
    {
      error: {
        message: err.message || 'Internal server error',
        status: 'error',
      },
    },
    500
  );
});

app.notFound((c) => {
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
