import app from './hono';

// Vercel serverless function handler
export default app;

// For Vercel compatibility
export const handler = app.fetch;
