import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { getUserChats } from '../../../services/message-store';

export const getUserChatsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().min(1),
    })
  )
  .query(({ input }) => {
    const chats = getUserChats(input.userId);
    return {
      chats,
      timestamp: Date.now(),
    };
  });
