import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { getChatMessages } from '../../../services/message-store';

export const getChatMessagesProcedure = publicProcedure
  .input(
    z.object({
      chatId: z.string().min(1),
      limit: z.number().optional(),
    })
  )
  .query(({ input }) => {
    const messages = getChatMessages(input.chatId, input.limit);
    return {
      chatId: input.chatId,
      messages,
      timestamp: Date.now(),
    };
  });
