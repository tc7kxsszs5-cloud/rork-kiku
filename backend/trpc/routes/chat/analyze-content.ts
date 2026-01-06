import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { analyzeTextContent } from '../../../services/content-filter';

export const analyzeContentProcedure = publicProcedure
  .input(
    z.object({
      text: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    const analysis = await analyzeTextContent(input.text);
    
    return {
      analysis,
      timestamp: Date.now(),
    };
  });
