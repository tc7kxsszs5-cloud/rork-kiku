import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { verifyAuthToken, AuthTokenPayload } from "../utils/authToken.js";

export interface AuthContext extends AuthTokenPayload {}

const getAuthFromRequest = async (req: Request): Promise<AuthContext | null> => {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) {
    return null;
  }
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!token) {
    return null;
  }
  return verifyAuthToken(token);
};

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const auth = await getAuthFromRequest(opts.req);
  return {
    req: opts.req,
    auth,
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
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next();
});
