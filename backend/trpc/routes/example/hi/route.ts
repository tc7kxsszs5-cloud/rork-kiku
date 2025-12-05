import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure
  .input(z.object({ name: z.string().optional() }).optional())
  .query(({ input }) => {
    const name = input?.name ?? 'Родитель';
    return {
      greeting: `Привет, ${name}!`,
      timestamp: new Date().toISOString(),
    };
  });
