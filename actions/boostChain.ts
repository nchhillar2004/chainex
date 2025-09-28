"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";

export async function boostChain(chainId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to boost a chain" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session. Please log in again." };
    }

    try {
        // Check if user already boosted this chain
        const existingBoost = await prisma.boost.findUnique({
            where: {
                userId_chainId: {
                    userId: session.userId,
                    chainId: chainId
                }
            }
        });

        if (existingBoost) {
            // Remove boost (unboost)
            await prisma.boost.delete({
                where: {
                    userId_chainId: {
                        userId: session.userId,
                        chainId: chainId
                    }
                }
            });
            return { success: true, boosted: false };
        } else {
            // Add boost
            await prisma.boost.create({
                data: {
                    userId: session.userId,
                    chainId: chainId
                }
            });
            return { success: true, boosted: true };
        }
    } catch (err: any) {
        console.error("Boost error:", err);
        return { error: "Failed to boost chain. Please try again." };
    }
}
