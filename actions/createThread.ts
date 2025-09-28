"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { addXP } from "@/actions/xpActions";
import { XP_REWARDS } from "@/lib/xpConstants";

export async function createThread(formData: FormData) {
    if (!formData) {
        return { error: "Invalid form data" };
    }

    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to create a thread" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session. Please log in again." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, isVerified: true, role: true, level: true }
    });

    if (!user) {
        return { error: "User not found" };
    }

    const chainIdStr = formData.get("chainId") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;

    if (!chainIdStr || !title || !content) {
        return { error: "All required fields must be filled" };
    }

    const chainId = parseInt(chainIdStr);
    if (isNaN(chainId)) {
        return { error: "Invalid chain ID" };
    }

    try {
        // Get the chain and check posting policy
        const chain = await prisma.chain.findUnique({
            where: { id: chainId },
            include: {
                members: {
                    where: { userId: user.id }
                }
            }
        });

        if (!chain) {
            return { error: "Chain not found" };
        }

        // Check if user is a member of the chain
        if (chain.members.length === 0) {
            return { error: "You must be a member of this chain to create threads" };
        }

        // Check posting policy
        if (chain.postPolicy === "VERIFIED_ONLY" && !user.isVerified && user.role !== "ADMIN") {
            return { error: "Only verified users can post in this chain" };
        }

        if (chain.postPolicy === "MODERATORS_ONLY") {
            // Check if user is a moderator or admin
            const isModerator = user.role === "ADMIN" || user.role === "MODERATOR";
            if (!isModerator) {
                return { error: "Only moderators can post in this chain" };
            }
        }

        if (chain.postPolicy === "LEVEL_BASED") {
            if (user.level < 2 && user.role !== "ADMIN") {
                return { error: "You need to be level 2 or higher to post in this chain" };
            }
        }

        // Create the thread
        const thread = await prisma.thread.create({
            data: {
                title,
                content,
                chainId,
                authorId: user.id
            }
        });

        // Give XP for creating a thread
        await addXP(user.id, XP_REWARDS.THREAD_CREATED, "THREAD_CREATED");

        // Add tags if provided
        if (tags && tags.trim()) {
            const tagNames = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            
            for (const tagName of tagNames.slice(0, 5)) { // Limit to 5 tags
                // Find or create tag
                const tag = await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName }
                });

                // Connect tag to thread
                await prisma.threadTag.create({
                    data: {
                        threadId: thread.id,
                        tagId: tag.id
                    }
                });
            }
        }

        return { success: true, threadId: thread.id };
    } catch (err: any) {
        console.error("Thread creation error:", err);
        return { error: "Failed to create thread. Please try again." };
    }
}
