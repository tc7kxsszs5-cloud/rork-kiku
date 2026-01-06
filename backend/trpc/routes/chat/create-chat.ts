import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { upsertChat } from '../../../services/message-store';

export const createChatProcedure = publicProcedure
  .input(
    z.object({
      chatId: z.string().min(1),
      participants: z.array(z.string()).min(2),
      participantNames: z.array(z.string()).min(2),
      isGroup: z.boolean().optional(),
      groupName: z.string().optional(),
      groupType: z.enum(['class', 'group', 'club']).optional(),
      groupDescription: z.string().optional(),
      adminIds: z.array(z.string()).optional(),
    })
  )
  .mutation(({ input }) => {
    const chat = upsertChat(input.chatId, {
      participants: input.participants,
      participantNames: input.participantNames,
      isGroup: input.isGroup,
      groupName: input.groupName,
      groupType: input.groupType,
      groupDescription: input.groupDescription,
      adminIds: input.adminIds,
    });
    
    return {
      chat,
      timestamp: Date.now(),
    };
  });
