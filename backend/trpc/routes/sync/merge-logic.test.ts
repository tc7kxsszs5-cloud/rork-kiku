/**
 * Unit тесты для merge логики синхронизации
 * Тестируем детерминированные алгоритмы без внешних зависимостей
 */

import { describe, it, expect } from 'bun:test';

// Импортируем функции для тестирования (нужно будет их экспортировать)
// Для тестов создадим копии логики или экспортируем функции

// Копия логики mergeChats для тестирования
const LEVEL_ORDER = ['safe', 'low', 'medium', 'high', 'critical'] as const;
type RiskLevel = typeof LEVEL_ORDER[number];

const mergeMessages = (serverMessages: any[], clientMessages: any[]): any[] => {
  const messageMap = new Map<string, any>();

  serverMessages.forEach((msg) => {
    messageMap.set(msg.id, msg);
  });

  clientMessages.forEach((msg) => {
    const existing = messageMap.get(msg.id);
    const msgTimestamp = msg.timestamp || 0;
    const existingTimestamp = existing?.timestamp || 0;
    
    if (!existing || msgTimestamp >= existingTimestamp) {
      messageMap.set(msg.id, msg);
    }
  });

  return Array.from(messageMap.values()).sort((a, b) => {
    const timestampA = a.timestamp || 0;
    const timestampB = b.timestamp || 0;
    return timestampA - timestampB;
  });
};

const mergeChats = (serverChats: any[], clientChats: any[]): any[] => {
  const mergedMap = new Map<string, any>();

  serverChats.forEach((chat) => {
    mergedMap.set(chat.id, { ...chat });
  });

  clientChats.forEach((clientChat) => {
    const existing = mergedMap.get(clientChat.id);
    
    if (!existing) {
      mergedMap.set(clientChat.id, { 
        ...clientChat,
        updatedAt: clientChat.updatedAt || Date.now(),
      });
    } else {
      const serverUpdatedAt = existing.updatedAt || existing.lastActivity || 0;
      const clientUpdatedAt = clientChat.updatedAt || clientChat.lastActivity || 0;
      
      const mergedMessages = mergeMessages(existing.messages || [], clientChat.messages || []);
      
      if (clientUpdatedAt > serverUpdatedAt) {
        mergedMap.set(clientChat.id, {
          ...clientChat,
          messages: mergedMessages,
          updatedAt: Math.max(clientUpdatedAt, serverUpdatedAt),
          lastActivity: Math.max(
            clientChat.lastActivity || 0,
            existing.lastActivity || 0
          ),
        });
      } else {
        mergedMap.set(existing.id, {
          ...existing,
          messages: mergedMessages,
          updatedAt: Math.max(clientUpdatedAt, serverUpdatedAt),
          lastActivity: Math.max(
            clientChat.lastActivity || 0,
            existing.lastActivity || 0
          ),
        });
      }
    }
  });

  return Array.from(mergedMap.values());
};

const mergeAlerts = (serverAlerts: any[], clientAlerts: any[]): any[] => {
  const alertMap = new Map<string, any>();

  serverAlerts.forEach((alert) => {
    alertMap.set(alert.id, alert);
  });

  clientAlerts.forEach((alert) => {
    const existing = alertMap.get(alert.id);
    const alertTimestamp = alert.timestamp || 0;
    const existingTimestamp = existing?.timestamp || 0;
    
    if (!existing || alertTimestamp >= existingTimestamp) {
      alertMap.set(alert.id, alert);
    }
  });

  return Array.from(alertMap.values()).sort((a, b) => {
    const timestampA = a.timestamp || 0;
    const timestampB = b.timestamp || 0;
    return timestampB - timestampA;
  });
};

const getDeltaChats = (allChats: any[], lastSyncTimestamp: number): any[] => {
  return allChats
    .map((chat) => {
      const chatUpdatedAt = chat.updatedAt || chat.lastActivity || chat.timestamp || 0;
      const hasNewMessages = (chat.messages || []).some(
        (msg: any) => (msg.timestamp || 0) > lastSyncTimestamp
      );
      
      if (chatUpdatedAt > lastSyncTimestamp || hasNewMessages) {
        if (hasNewMessages && chat.messages) {
          return {
            ...chat,
            messages: chat.messages.filter((msg: any) => (msg.timestamp || 0) > lastSyncTimestamp),
          };
        }
        return chat;
      }
      return null;
    })
    .filter((chat): chat is any => chat !== null);
};

describe('mergeMessages', () => {
  it('должен объединять сообщения из сервера и клиента', () => {
    const serverMessages = [
      { id: 'msg1', text: 'Server message', timestamp: 1000 },
      { id: 'msg2', text: 'Server message 2', timestamp: 2000 },
    ];
    const clientMessages = [
      { id: 'msg3', text: 'Client message', timestamp: 1500 },
      { id: 'msg2', text: 'Client updated', timestamp: 2500 }, // Обновление msg2
    ];

    const result = mergeMessages(serverMessages, clientMessages);

    expect(result).toHaveLength(3);
    expect(result.find((m: any) => m.id === 'msg2')?.text).toBe('Client updated');
    expect(result.find((m: any) => m.id === 'msg1')).toBeDefined();
    expect(result.find((m: any) => m.id === 'msg3')).toBeDefined();
  });

  it('должен сохранять порядок сообщений по timestamp', () => {
    const serverMessages = [
      { id: 'msg1', text: 'First', timestamp: 1000 },
      { id: 'msg3', text: 'Third', timestamp: 3000 },
    ];
    const clientMessages = [
      { id: 'msg2', text: 'Second', timestamp: 2000 },
    ];

    const result = mergeMessages(serverMessages, clientMessages);

    expect(result[0].id).toBe('msg1');
    expect(result[1].id).toBe('msg2');
    expect(result[2].id).toBe('msg3');
  });

  it('должен использовать более свежее сообщение при конфликте', () => {
    const serverMessages = [
      { id: 'msg1', text: 'Server version', timestamp: 1000 },
    ];
    const clientMessages = [
      { id: 'msg1', text: 'Client version', timestamp: 2000 },
    ];

    const result = mergeMessages(serverMessages, clientMessages);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Client version');
  });

  it('должен обрабатывать пустые массивы', () => {
    expect(mergeMessages([], [])).toEqual([]);
    expect(mergeMessages([{ id: 'msg1', text: 'Test', timestamp: 1000 }], [])).toHaveLength(1);
    expect(mergeMessages([], [{ id: 'msg1', text: 'Test', timestamp: 1000 }])).toHaveLength(1);
  });
});

describe('mergeChats', () => {
  it('должен объединять чаты из сервера и клиента', () => {
    const serverChats = [
      { id: 'chat1', participants: ['user1'], messages: [], updatedAt: 1000 },
    ];
    const clientChats = [
      { id: 'chat2', participants: ['user2'], messages: [], updatedAt: 2000 },
    ];

    const result = mergeChats(serverChats, clientChats);

    expect(result).toHaveLength(2);
    expect(result.find((c: any) => c.id === 'chat1')).toBeDefined();
    expect(result.find((c: any) => c.id === 'chat2')).toBeDefined();
  });

  it('должен объединять сообщения в существующих чатах', () => {
    const serverChats = [
      { 
        id: 'chat1', 
        participants: ['user1'], 
        messages: [{ id: 'msg1', text: 'Server msg', timestamp: 1000 }],
        updatedAt: 1000 
      },
    ];
    const clientChats = [
      { 
        id: 'chat1', 
        participants: ['user1'], 
        messages: [{ id: 'msg2', text: 'Client msg', timestamp: 2000 }],
        updatedAt: 2000 
      },
    ];

    const result = mergeChats(serverChats, clientChats);

    expect(result).toHaveLength(1);
    expect(result[0].messages).toHaveLength(2);
  });

  it('должен использовать более свежие метаданные при конфликте', () => {
    const serverChats = [
      { id: 'chat1', participants: ['user1'], title: 'Server title', updatedAt: 1000 },
    ];
    const clientChats = [
      { id: 'chat1', participants: ['user1'], title: 'Client title', updatedAt: 2000 },
    ];

    const result = mergeChats(serverChats, clientChats);

    expect(result[0].title).toBe('Client title');
    expect(result[0].updatedAt).toBeGreaterThanOrEqual(2000);
  });

  it('должен сохранять максимальный lastActivity', () => {
    const serverChats = [
      { id: 'chat1', participants: ['user1'], lastActivity: 1000, updatedAt: 1000 },
    ];
    const clientChats = [
      { id: 'chat1', participants: ['user1'], lastActivity: 2000, updatedAt: 1000 },
    ];

    const result = mergeChats(serverChats, clientChats);

    expect(result[0].lastActivity).toBe(2000);
  });
});

describe('mergeAlerts', () => {
  it('должен объединять алерты без дубликатов', () => {
    const serverAlerts = [
      { id: 'alert1', riskLevel: 'high', timestamp: 1000 },
      { id: 'alert2', riskLevel: 'medium', timestamp: 2000 },
    ];
    const clientAlerts = [
      { id: 'alert3', riskLevel: 'critical', timestamp: 3000 },
    ];

    const result = mergeAlerts(serverAlerts, clientAlerts);

    expect(result).toHaveLength(3);
  });

  it('должен использовать более свежий алерт при конфликте', () => {
    const serverAlerts = [
      { id: 'alert1', riskLevel: 'high', timestamp: 1000 },
    ];
    const clientAlerts = [
      { id: 'alert1', riskLevel: 'critical', timestamp: 2000 },
    ];

    const result = mergeAlerts(serverAlerts, clientAlerts);

    expect(result).toHaveLength(1);
    expect(result[0].riskLevel).toBe('critical');
  });

  it('должен сортировать алерты по timestamp (новые сначала)', () => {
    const serverAlerts = [
      { id: 'alert1', riskLevel: 'high', timestamp: 3000 },
      { id: 'alert2', riskLevel: 'medium', timestamp: 1000 },
    ];

    const result = mergeAlerts(serverAlerts, []);

    expect(result[0].id).toBe('alert1');
    expect(result[1].id).toBe('alert2');
  });
});

describe('getDeltaChats', () => {
  it('должен возвращать только измененные чаты', () => {
    const allChats = [
      { id: 'chat1', updatedAt: 1000, messages: [] },
      { id: 'chat2', updatedAt: 3000, messages: [] },
      { id: 'chat3', updatedAt: 500, messages: [] },
    ];
    const lastSyncTimestamp = 2000;

    const result = getDeltaChats(allChats, lastSyncTimestamp);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('chat2');
  });

  it('должен фильтровать новые сообщения в чатах', () => {
    const allChats = [
      {
        id: 'chat1',
        updatedAt: 1000,
        messages: [
          { id: 'msg1', timestamp: 500 },
          { id: 'msg2', timestamp: 2500 },
          { id: 'msg3', timestamp: 3000 },
        ],
      },
    ];
    const lastSyncTimestamp = 2000;

    const result = getDeltaChats(allChats, lastSyncTimestamp);

    expect(result).toHaveLength(1);
    expect(result[0].messages).toHaveLength(2);
    expect(result[0].messages[0].id).toBe('msg2');
    expect(result[0].messages[1].id).toBe('msg3');
  });

  it('должен возвращать пустой массив если нет изменений', () => {
    const allChats = [
      { id: 'chat1', updatedAt: 1000, messages: [] },
      { id: 'chat2', updatedAt: 1500, messages: [] },
    ];
    const lastSyncTimestamp = 2000;

    const result = getDeltaChats(allChats, lastSyncTimestamp);

    expect(result).toEqual([]);
  });

  it('должен обрабатывать чаты с lastActivity вместо updatedAt', () => {
    const allChats = [
      { id: 'chat1', lastActivity: 3000, messages: [] },
    ];
    const lastSyncTimestamp = 2000;

    const result = getDeltaChats(allChats, lastSyncTimestamp);

    expect(result).toHaveLength(1);
  });
});


