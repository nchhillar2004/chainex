"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function followUser(targetUserId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to follow users" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    if (session.userId === targetUserId) {
        return { error: "You cannot follow yourself" };
    }

    try {
        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: session.userId,
                    followedId: targetUserId
                }
            }
        });

        if (existingFollow) {
            return { error: "You are already following this user" };
        }

        // Create follow relationship
        await prisma.follow.create({
            data: {
                followerId: session.userId,
                followedId: targetUserId
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Follow error:", err);
        return { error: "Failed to follow user" };
    }
}

export async function unfollowUser(targetUserId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to unfollow users" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: session.userId,
                    followedId: targetUserId
                }
            }
        });

        if (!existingFollow) {
            return { error: "You are not following this user" };
        }

        // Remove follow relationship
        await prisma.follow.delete({
            where: {
                followerId_followedId: {
                    followerId: session.userId,
                    followedId: targetUserId
                }
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Unfollow error:", err);
        return { error: "Failed to unfollow user" };
    }
}

export async function deleteUserPost(postId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to delete posts" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Get the post and check ownership
        const post = await prisma.thread.findUnique({
            where: { id: postId },
            select: {
                id: true,
                authorId: true,
                chain: {
                    select: {
                        creatorId: true
                    }
                }
            }
        });

        if (!post) {
            return { error: "Post not found" };
        }

        // Check if user is the author or admin
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const isAuthor = post.authorId === session.userId;
        const isAdmin = user.role === "ADMIN";
        const isChainOwner = post.chain.creatorId === session.userId;

        if (!isAuthor && !isAdmin && !isChainOwner) {
            return { error: "You don't have permission to delete this post" };
        }

        // Soft delete the post
        await prisma.thread.update({
            where: { id: postId },
            data: { deletedAt: new Date() }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Delete post error:", err);
        return { error: "Failed to delete post" };
    }
}

export async function deleteUserCommunity(communityId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to delete communities" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Get the community and check ownership
        const community = await prisma.chain.findUnique({
            where: { id: communityId },
            select: {
                id: true,
                creatorId: true
            }
        });

        if (!community) {
            return { error: "Community not found" };
        }

        // Check if user is the creator or admin
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const isCreator = community.creatorId === session.userId;
        const isAdmin = user.role === "ADMIN";

        if (!isCreator && !isAdmin) {
            return { error: "You don't have permission to delete this community" };
        }

        // Soft delete the community
        await prisma.chain.update({
            where: { id: communityId },
            data: { deletedAt: new Date() }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Delete community error:", err);
        return { error: "Failed to delete community" };
    }
}

export async function banUserFromCommunity(data: { userId: number; chainId: number; reason?: string }) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if user is chain owner or admin
        const chain = await prisma.chain.findUnique({
            where: { id: data.chainId },
            select: { creatorId: true }
        });

        if (!chain) {
            return { error: "Community not found" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const isChainOwner = chain.creatorId === session.userId;
        const isAdmin = user.role === "ADMIN";

        if (!isChainOwner && !isAdmin) {
            return { error: "You don't have permission to ban users from this community" };
        }

        // Check if user is already banned
        const existingBan = await prisma.chainBan.findUnique({
            where: {
                chainId_bannedUserId: {
                    chainId: data.chainId,
                    bannedUserId: data.userId
                }
            }
        });

        if (existingBan) {
            return { error: "User is already banned from this community" };
        }

        // Create ban
        await prisma.chainBan.create({
            data: {
                chainId: data.chainId,
                bannedUserId: data.userId,
                issuerId: session.userId,
                banType: "BAN",
                reason: data.reason || "No reason provided"
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Ban user error:", err);
        return { error: "Failed to ban user" };
    }
}

export async function unbanUserFromCommunity(data: { userId: number; chainId: number }) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    try {
        // Check if user is chain owner or admin
        const chain = await prisma.chain.findUnique({
            where: { id: data.chainId },
            select: { creatorId: true }
        });

        if (!chain) {
            return { error: "Community not found" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        const isChainOwner = chain.creatorId === session.userId;
        const isAdmin = user.role === "ADMIN";

        if (!isChainOwner && !isAdmin) {
            return { error: "You don't have permission to unban users from this community" };
        }

        // Remove ban
        await prisma.chainBan.deleteMany({
            where: {
                chainId: data.chainId,
                bannedUserId: data.userId
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Unban user error:", err);
        return { error: "Failed to unban user" };
    }
}
