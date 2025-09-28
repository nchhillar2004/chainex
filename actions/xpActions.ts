"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { XP_REWARDS, LEVEL_THRESHOLDS } from "@/lib/xpConstants";

export async function addXP(userId: number, amount: number, action: string) {
    try {
        // Get current user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, experience: true, level: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const newXP = user.experience + amount;
        const newLevel = calculateLevel(newXP);

        // Update user XP and level
        await prisma.user.update({
            where: { id: userId },
            data: {
                experience: newXP,
                level: newLevel
            }
        });

        // Log XP gain
        await prisma.xpLog.create({
            data: {
                userId: userId,
                amount: amount,
                action: action,
                newTotal: newXP,
                newLevel: newLevel
            }
        });

        return { 
            success: true, 
            newXP, 
            newLevel, 
            levelUp: newLevel > user.level 
        };
    } catch (err: any) {
        console.error("Add XP error:", err);
        return { error: "Failed to add XP" };
    }
}

export async function calculateLevel(xp: number): Promise<number> {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

export async function getXPLeaderboard(limit: number = 10) {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null
            },
            select: {
                id: true,
                username: true,
                experience: true,
                level: true,
                isVerified: true,
                avatarUrl: true
            },
            orderBy: {
                experience: 'desc'
            },
            take: limit
        });

        return users;
    } catch (err: any) {
        console.error("Get XP leaderboard error:", err);
        return [];
    }
}

export async function getUserXPHistory(userId: number, limit: number = 20) {
    try {
        const xpHistory = await prisma.xpLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return xpHistory;
    } catch (err: any) {
        console.error("Get XP history error:", err);
        return [];
    }
}
