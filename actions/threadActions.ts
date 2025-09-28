"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { addXP } from "@/actions/xpActions";
import { XP_REWARDS } from "@/lib/xpConstants";

export async function voteThread(threadId: number, voteType: 'UP' | 'DOWN') {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to vote" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if user already voted
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_threadId: {
                    userId: session.userId,
                    threadId: threadId
                }
            }
        });

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // Remove vote (unvote)
                await prisma.vote.delete({
                    where: {
                        userId_threadId: {
                            userId: session.userId,
                            threadId: threadId
                        }
                    }
                });
                return { success: true, voted: false };
            } else {
                // Update vote
                await prisma.vote.update({
                    where: {
                        userId_threadId: {
                            userId: session.userId,
                            threadId: threadId
                        }
                    },
                    data: { voteType }
                });
                return { success: true, voted: true };
            }
        } else {
            // Create new vote
            await prisma.vote.create({
                data: {
                    userId: session.userId,
                    threadId: threadId,
                    voteType
                }
            });

            // Give XP for voting
            const xpAmount = voteType === 'UP' ? XP_REWARDS.UPVOTE_GIVEN : XP_REWARDS.DOWNVOTE_GIVEN;
            await addXP(session.userId, xpAmount, voteType === 'UP' ? "UPVOTE_GIVEN" : "DOWNVOTE_GIVEN");

            return { success: true, voted: true };
        }
    } catch (err: any) {
        console.error("Vote error:", err);
        return { error: "Failed to vote" };
    }
}

export async function pinThread(threadId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Get thread and check if user is chain creator or admin
        const thread = await prisma.thread.findUnique({
            where: { id: threadId },
            include: {
                chain: {
                    select: {
                        creatorId: true
                    }
                }
            }
        });

        if (!thread) {
            return { error: "Thread not found" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        if (!user || (user.role !== "ADMIN" && user.id !== thread.chain.creatorId)) {
            return { error: "Only chain creators can pin threads" };
        }

        // Check if thread is already pinned
        const existingPin = await prisma.pinnedThread.findUnique({
            where: {
                chainId_threadId: {
                    chainId: thread.chainId,
                    threadId: threadId
                }
            }
        });

        if (existingPin) {
            // Unpin
            await prisma.pinnedThread.delete({
                where: {
                    chainId_threadId: {
                        chainId: thread.chainId,
                        threadId: threadId
                    }
                }
            });
            return { success: true, pinned: false };
        } else {
            // Pin
            await prisma.pinnedThread.create({
                data: {
                    chainId: thread.chainId,
                    threadId: threadId
                }
            });
            return { success: true, pinned: true };
        }
    } catch (err: any) {
        console.error("Pin error:", err);
        return { error: "Failed to pin thread" };
    }
}

export async function createReply(threadId: number, content: string) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to reply" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if thread exists
        const thread = await prisma.thread.findUnique({
            where: { id: threadId }
        });

        if (!thread) {
            return { error: "Thread not found" };
        }

        // Create reply
        await prisma.reply.create({
            data: {
                content,
                threadId,
                authorId: session.userId
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Reply creation error:", err);
        return { error: "Failed to create reply" };
    }
}
