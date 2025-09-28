import prisma from "@/lib/db";
import { getSession } from "./session";
import { cookies } from "next/headers";

export async function getTopChains(limit: number = 10, userId?: number) {
    try {
        const chains = await prisma.chain.findMany({
            where: {
                visibility: "PUBLIC",
                deletedAt: null
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                },
                chainTags: {
                    include: {
                        tag: true
                    }
                },
                members: {
                    select: {
                        id: true
                    }
                },
                threads: {
                    select: {
                        id: true
                    }
                },
                boosts: userId ? {
                    where: {
                        userId: userId
                    },
                    select: {
                        id: true
                    }
                } : false,
                _count: {
                    select: {
                        members: true,
                        threads: true,
                        boosts: true
                    }
                }
            },
            orderBy: [
                { boosts: { _count: 'desc' } },
                { members: { _count: 'desc' } },
                { createdAt: 'desc' }
            ],
            take: limit
        });

        // Add userBoosted property to each chain
        const chainsWithBoostStatus = chains.map((chain: any) => ({
            ...chain,
            userBoosted: userId ? chain.boosts && chain.boosts.length > 0 : false
        }));

        return chainsWithBoostStatus;
    } catch (error) {
        console.error("Error fetching chains:", error);
        return [];
    }
}

export async function getChainBySlug(slug: string) {
    try {
        const chain = await prisma.chain.findUnique({
            where: {
                slug: slug
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true
                    }
                },
                chainTags: {
                    include: {
                        tag: true
                    }
                },
                members: {
                    select: {
                        id: true
                    }
                },
                threads: {
                    select: {
                        id: true
                    }
                },
                _count: {
                    select: {
                        members: true,
                        threads: true,
                        boosts: true
                    }
                }
            }
        });

        return chain;
    } catch (error) {
        console.error("Error fetching chain:", error);
        return null;
    }
}
