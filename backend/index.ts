import app from './hono';

// Vercel serverless function handler
export default app;

// Export handler for Vercel
export const handler = app.fetch;
