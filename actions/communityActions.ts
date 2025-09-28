"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function joinCommunity(chainId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to join communities" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Get the chain and check eligibility
        const chain = await prisma.chain.findUnique({
            where: { id: chainId },
            select: {
                id: true,
                name: true,
                visibility: true,
                minAge: true,
                maxAge: true,
                creatorId: true,
                members: {
                    where: { userId: session.userId },
                    select: { id: true }
                }
            }
        });

        if (!chain) {
            return { error: "Community not found" };
        }

        // Check if already a member
        if (chain.members.length > 0) {
            return { error: "You are already a member of this community" };
        }

        // Check if user is the creator
        if (chain.creatorId === session.userId) {
            return { error: "You are the creator of this community" };
        }

        // Get user details for eligibility check
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                isVerified: true,
                level: true,
                dob: true
            }
        });

        if (!user) {
            return { error: "User not found" };
        }

        // Check verification requirement for age-restricted communities
        if (chain.minAge || chain.maxAge) {
            if (!user.isVerified) {
                return { error: "You must be verified to join this community" };
            }
        }

        // Create membership
        await prisma.chainMember.create({
            data: {
                userId: session.userId,
                chainId: chainId
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Join community error:", err);
        return { error: "Failed to join community" };
    }
}

export async function leaveCommunity(chainId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to leave communities" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if user is a member
        const membership = await prisma.chainMember.findUnique({
            where: {
                userId_chainId: {
                    userId: session.userId,
                    chainId: chainId
                }
            }
        });

        if (!membership) {
            return { error: "You are not a member of this community" };
        }

        // Remove membership
        await prisma.chainMember.delete({
            where: {
                userId_chainId: {
                    userId: session.userId,
                    chainId: chainId
                }
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Leave community error:", err);
        return { error: "Failed to leave community" };
    }
}

export async function checkEligibility(chainId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { 
            eligible: false, 
            reason: "You must be logged in to join communities",
            criteria: []
        };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { 
            eligible: false, 
            reason: "Invalid session",
            criteria: []
        };
    }

    try {
        // Get the chain
        const chain = await prisma.chain.findUnique({
            where: { id: chainId },
            select: {
                id: true,
                visibility: true,
                minAge: true,
                maxAge: true,
                creatorId: true,
                members: {
                    where: { userId: session.userId },
                    select: { id: true }
                }
            }
        });

        if (!chain) {
            return { 
                eligible: false, 
                reason: "Community not found",
                criteria: []
            };
        }

        // Check if already a member
        if (chain.members.length > 0) {
            return { 
                eligible: false, 
                reason: "You are already a member of this community",
                criteria: []
            };
        }

        // Check if user is the creator
        if (chain.creatorId === session.userId) {
            return { 
                eligible: false, 
                reason: "You are the creator of this community",
                criteria: []
            };
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                isVerified: true,
                level: true,
                dob: true
            }
        });

        if (!user) {
            return { 
                eligible: false, 
                reason: "User not found",
                criteria: []
            };
        }

        const criteria = [];
        let eligible = true;
        let reason = "";

        // Check verification requirement for age-restricted communities
        if (chain.minAge || chain.maxAge) {
            if (!user.isVerified) {
                criteria.push("Be verified (required for age-restricted communities)");
                eligible = false;
                reason = "You must be verified to join this community";
            }
        }

        return {
            eligible,
            reason,
            criteria,
            isMember: false,
            isCreator: false
        };
    } catch (err: any) {
        console.error("Check eligibility error:", err);
        return { 
            eligible: false, 
            reason: "Failed to check eligibility",
            criteria: []
        };
    }
}
