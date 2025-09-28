import { redis } from "./redis";
import { randomBytes } from "crypto";
import { logger } from './logger';
import { validateSessionSecurity } from './security';

// 7 days session
const SESSION_TTL = 60 * 60 * 24 * 7;

export interface SessionData {
    userId: number;
    createdAt: number;
    lastAccessed: number;
    ip?: string;
    userAgent?: string;
    isActive: boolean;
}

export async function createSession(userId: number, ip?: string, userAgent?: string): Promise<string> {
    const sessionId = randomBytes(64).toString("hex");
    const now = Date.now();
    
    const sessionData: SessionData = {
        userId,
        createdAt: now,
        lastAccessed: now,
        ip,
        userAgent,
        isActive: true,
    };
    
    try {
        await redis.set(`session:${sessionId}`,
            JSON.stringify(sessionData),
            { ex: SESSION_TTL });
        
        // Track user sessions for security monitoring
        await redis.sadd(`user_sessions:${userId}`, sessionId);
        await redis.expire(`user_sessions:${userId}`, SESSION_TTL);
        
        logger.info('Session created', {
            userId,
            sessionId: sessionId.substring(0, 8) + '...',
            ip,
            userAgent: userAgent?.substring(0, 100),
        });
        
        return sessionId;
    } catch (error) {
        logger.error('Failed to create session', { error, userId });
        throw new Error('Session creation failed');
    }
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
    try {
        const session = await redis.get<string>(`session:${sessionId}`);
        
        if (!session) {
            return null;
        }
        
        const sessionData: SessionData = typeof session === "string" ? JSON.parse(session) : session;
        
        // Validate session security
        if (!validateSessionSecurity(sessionData)) {
            await deleteSession(sessionId);
            logger.securityViolation('Invalid session detected', { 
                sessionId: sessionId.substring(0, 8) + '...' 
            });
            return null;
        }
        
        // Update last accessed time
        sessionData.lastAccessed = Date.now();
        await redis.set(`session:${sessionId}`,
            JSON.stringify(sessionData),
            { ex: SESSION_TTL });
        
        return sessionData;
    } catch (error) {
        logger.error('Failed to get session', { error, sessionId: sessionId.substring(0, 8) + '...' });
        return null;
    }
}

export async function deleteSession(sessionId: string): Promise<void> {
    try {
        const session = await redis.get<string>(`session:${sessionId}`);
        
        if (session) {
            const sessionData: SessionData = typeof session === "string" ? JSON.parse(session) : session;
            
            // Remove from user sessions tracking
            await redis.srem(`user_sessions:${sessionData.userId}`, sessionId);
        }
        
        await redis.del(`session:${sessionId}`);
        
        logger.info('Session deleted', { sessionId: sessionId.substring(0, 8) + '...' });
    } catch (error) {
        logger.error('Failed to delete session', { error, sessionId: sessionId.substring(0, 8) + '...' });
    }
}

export async function destroyAllUserSessions(userId: number): Promise<void> {
    try {
        const sessionIds = await redis.smembers(`user_sessions:${userId}`);
        
        if (sessionIds.length > 0) {
            const pipeline = redis.pipeline();
            
            // Delete all sessions
            sessionIds.forEach(sessionId => {
                pipeline.del(`session:${sessionId}`);
            });
            
            // Clear user sessions tracking
            pipeline.del(`user_sessions:${userId}`);
            
            await pipeline.exec();
            
            logger.info('All user sessions destroyed', { userId, sessionCount: sessionIds.length });
        }
    } catch (error) {
        logger.error('Failed to destroy all user sessions', { error, userId });
    }
}

export async function getActiveUserSessions(userId: number): Promise<SessionData[]> {
    try {
        const sessionIds = await redis.smembers(`user_sessions:${userId}`);
        const sessions: SessionData[] = [];
        
        for (const sessionId of sessionIds) {
            const session = await redis.get<string>(`session:${sessionId}`);
            if (session) {
                const sessionData: SessionData = typeof session === "string" ? JSON.parse(session) : session;
                if (sessionData.isActive) {
                    sessions.push(sessionData);
                }
            }
        }
        
        return sessions;
    } catch (error) {
        logger.error('Failed to get active user sessions', { error, userId });
        return [];
    }
}

export async function refreshSession(sessionId: string): Promise<boolean> {
    try {
        const session = await redis.get<string>(`session:${sessionId}`);
        
        if (!session) {
            return false;
        }
        
        const sessionData: SessionData = typeof session === "string" ? JSON.parse(session) : session;
        sessionData.lastAccessed = Date.now();
        
        await redis.set(`session:${sessionId}`,
            JSON.stringify(sessionData),
            { ex: SESSION_TTL });
        
        return true;
    } catch (error) {
        logger.error('Failed to refresh session', { error, sessionId: sessionId.substring(0, 8) + '...' });
        return false;
    }
}
