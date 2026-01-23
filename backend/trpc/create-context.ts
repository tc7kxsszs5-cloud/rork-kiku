import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    req: opts.req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      ...shape,
      data: {
        ...shape.data,
        // Only show stack trace in development
        stack: isDevelopment ? error.stack : undefined,
        // Sanitize error message in production
        message: isDevelopment 
          ? error.message 
          : error.code === 'BAD_REQUEST' || error.code === 'UNAUTHORIZED'
            ? error.message
            : 'An error occurred. Please try again.',
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
