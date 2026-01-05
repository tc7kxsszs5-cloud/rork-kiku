/**
 * WebSocket Connection Manager
 * Manages WebSocket connections, authentication, and message routing
 */

import { ConnectionSession, WSMessage, WS_EVENTS } from './types';

/**
 * WebSocket connection wrapper
 */
interface WSConnection {
  id: string;
  userId: string;
  send: (data: string) => void;
  close: () => void;
}

/**
 * WebSocket Manager Service
 * Handles all WebSocket connections and message routing
 */
export class WebSocketManager {
  private connections: Map<string, WSConnection> = new Map();
  private userConnections: Map<string, Set<string>> = new Map();
  private sessions: Map<string, ConnectionSession> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    this.startHeartbeat();
  }
  
  /**
   * Register a new WebSocket connection
   */
  registerConnection(
    connectionId: string,
    userId: string,
    sendFn: (data: string) => void,
    closeFn: () => void
  ): void {
    const connection: WSConnection = {
      id: connectionId,
      userId,
      send: sendFn,
      close: closeFn,
    };
    
    this.connections.set(connectionId, connection);
    
    // Track user connections
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);
    
    // Create session
    const session: ConnectionSession = {
      userId,
      connectionId,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
    };
    this.sessions.set(connectionId, session);
    
    console.log(`[WS] User ${userId} connected (${connectionId})`);
  }
  
  /**
   * Unregister a connection
   */
  unregisterConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    
    const { userId } = connection;
    
    // Remove from connections
    this.connections.delete(connectionId);
    
    // Remove from user connections
    const userConns = this.userConnections.get(userId);
    if (userConns) {
      userConns.delete(connectionId);
      if (userConns.size === 0) {
        this.userConnections.delete(userId);
      }
    }
    
    // Remove session
    this.sessions.delete(connectionId);
    
    console.log(`[WS] User ${userId} disconnected (${connectionId})`);
  }
  
  /**
   * Send message to a specific user (all their connections)
   */
  sendToUser(userId: string, event: string, data: unknown): void {
    const message: WSMessage = {
      event,
      data,
      timestamp: Date.now(),
    };
    
    const connectionIds = this.userConnections.get(userId);
    if (!connectionIds || connectionIds.size === 0) {
      console.log(`[WS] User ${userId} not connected`);
      return;
    }
    
    const payload = JSON.stringify(message);
    connectionIds.forEach(connId => {
      const connection = this.connections.get(connId);
      if (connection) {
        try {
          connection.send(payload);
        } catch (error) {
          console.error(`[WS] Error sending to connection ${connId}:`, error);
        }
      }
    });
  }
  
  /**
   * Send message to multiple users
   */
  sendToUsers(userIds: string[], event: string, data: unknown): void {
    userIds.forEach(userId => this.sendToUser(userId, event, data));
  }
  
  /**
   * Broadcast to all connections
   */
  broadcast(event: string, data: unknown): void {
    const message: WSMessage = {
      event,
      data,
      timestamp: Date.now(),
    };
    
    const payload = JSON.stringify(message);
    this.connections.forEach(connection => {
      try {
        connection.send(payload);
      } catch (error) {
        console.error(`[WS] Error broadcasting to ${connection.id}:`, error);
      }
    });
  }
  
  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.userConnections.has(userId) && 
           this.userConnections.get(userId)!.size > 0;
  }
  
  /**
   * Get active connection count
   */
  getConnectionCount(): number {
    return this.connections.size;
  }
  
  /**
   * Get active user count
   */
  getActiveUserCount(): number {
    return this.userConnections.size;
  }
  
  /**
   * Update last activity for a connection
   */
  updateActivity(connectionId: string): void {
    const session = this.sessions.get(connectionId);
    if (session) {
      session.lastActivity = Date.now();
    }
  }
  
  /**
   * Start heartbeat to check connection health
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 5 * 60 * 1000; // 5 minutes
      
      this.sessions.forEach((session, connectionId) => {
        if (now - session.lastActivity > timeout) {
          console.log(`[WS] Connection ${connectionId} timed out`);
          const connection = this.connections.get(connectionId);
          if (connection) {
            connection.close();
          }
          this.unregisterConnection(connectionId);
        }
      });
    }, 60000); // Check every minute
  }
  
  /**
   * Stop heartbeat
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  /**
   * Close all connections
   */
  closeAll(): void {
    this.connections.forEach(conn => {
      try {
        conn.close();
      } catch (error) {
        console.error(`[WS] Error closing connection ${conn.id}:`, error);
      }
    });
    
    this.connections.clear();
    this.userConnections.clear();
    this.sessions.clear();
    this.stopHeartbeat();
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
