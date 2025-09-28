"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { addXP } from "@/actions/xpActions";
import { XP_REWARDS } from "@/lib/xpConstants";

export async function generateReferralCodeForUser(userId: number) {
    try {
        // Check if user already has a referral code
        const existingCode = await prisma.referralCode.findFirst({
            where: { 
                creatorId: userId,
                status: "ACTIVE"
            }
        });

        if (existingCode) {
            return { success: true, referralCode: existingCode };
        }

        // Generate unique referral code
        const generateCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        let code: string;
        let isUnique = false;
        let attempts = 0;

        // Ensure code is unique
        while (!isUnique && attempts < 10) {
            code = generateCode();
            const existing = await prisma.referralCode.findUnique({
                where: { code }
            });
            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return { error: "Failed to generate unique referral code" };
        }

        // Create referral code
        const referralCode = await prisma.referralCode.create({
            data: {
                code: code!,
                creatorId: userId,
                status: "ACTIVE",
                maxUses: 5,
                currentUses: 0,
                createdAt: new Date()
            }
        });

        return { success: true, referralCode };
    } catch (err: any) {
        console.error("Generate referral code error:", err);
        return { error: "Failed to generate referral code" };
    }
}

export async function deactivateReferralCode(codeId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to deactivate referral codes" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if user owns this referral code
        const referralCode = await prisma.referralCode.findUnique({
            where: { id: codeId },
            select: { id: true, creatorId: true, status: true }
        });

        if (!referralCode) {
            return { error: "Referral code not found" };
        }

        if (referralCode.creatorId !== session.userId) {
            return { error: "You don't have permission to deactivate this referral code" };
        }

        if (referralCode.status !== "ACTIVE") {
            return { error: "Referral code is already inactive" };
        }

        // Deactivate referral code
        await prisma.referralCode.update({
            where: { id: codeId },
            data: { status: "INACTIVE" }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Deactivate referral code error:", err);
        return { error: "Failed to deactivate referral code" };
    }
}

export async function getUserReferralCode() {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        const referralCode = await prisma.referralCode.findFirst({
            where: { 
                creatorId: session.userId,
                status: "ACTIVE"
            },
            select: {
                id: true,
                code: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        verificationRequests: true
                    }
                }
            }
        });

        return { success: true, referralCode };
    } catch (err: any) {
        console.error("Get referral code error:", err);
        return { error: "Failed to get referral code" };
    }
}

export async function validateReferralCode(code: string) {
    try {
        const referralCode = await prisma.referralCode.findUnique({
            where: { code },
            select: {
                id: true,
                code: true,
                status: true,
                currentUses: true,
                maxUses: true,
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        });

        if (!referralCode) {
            return { valid: false, error: "Referral code not found" };
        }

        if (referralCode.status !== "ACTIVE") {
            return { valid: false, error: "Referral code is no longer active" };
        }

        if (referralCode.currentUses >= referralCode.maxUses) {
            return { valid: false, error: "Referral code has reached maximum uses" };
        }

        return { 
            valid: true, 
            referralCode: {
                id: referralCode.id,
                code: referralCode.code,
                creator: referralCode.creator.username,
                usesLeft: referralCode.maxUses - referralCode.currentUses
            }
        };
    } catch (err: any) {
        console.error("Validate referral code error:", err);
        return { valid: false, error: "Failed to validate referral code" };
    }
}

export async function useReferralCode(code: string, userId: number) {
    try {
        const referralCode = await prisma.referralCode.findUnique({
            where: { code },
            select: {
                id: true,
                creatorId: true,
                currentUses: true,
                maxUses: true,
                status: true
            }
        });

        if (!referralCode) {
            return { error: "Referral code not found" };
        }

        if (referralCode.status !== "ACTIVE") {
            return { error: "Referral code is no longer active" };
        }

        if (referralCode.currentUses >= referralCode.maxUses) {
            return { error: "Referral code has reached maximum uses" };
        }

        // Check if user already used this code
        const existingUsage = await prisma.referralUsage.findUnique({
            where: {
                referralCodeId_userId: {
                    referralCodeId: referralCode.id,
                    userId: userId
                }
            }
        });

        if (existingUsage) {
            return { error: "You have already used this referral code" };
        }

        // Update referral code usage
        await prisma.referralCode.update({
            where: { id: referralCode.id },
            data: {
                currentUses: referralCode.currentUses + 1
            }
        });

        // Record usage
        await prisma.referralUsage.create({
            data: {
                referralCodeId: referralCode.id,
                userId: userId,
                usedAt: new Date()
            }
        });

        // Give XP to both users
        await addXP(userId, XP_REWARDS.REFERRAL_USED, "REFERRAL_USED");
        await addXP(referralCode.creatorId, XP_REWARDS.REFERRAL_EARNED, "REFERRAL_EARNED");

        return { success: true };
    } catch (err: any) {
        console.error("Use referral code error:", err);
        return { error: "Failed to use referral code" };
    }
}
