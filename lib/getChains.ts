import prisma from "@/lib/db";

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
                        id: true,
                        title: true,
                        createdAt: true,
                        author: {
                            select: {
                                username: true
                            }
                        }
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
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
            const chainsWithBoostStatus = chains.map((chain) => ({
            ...chain,
            userBoosted: userId ? chain.boosts && chain.boosts.length > 0 : false
        }));

        return chainsWithBoostStatus;
    } catch (error) {
        console.error("Error fetching chains:", error);
        return [];
    }
}

export async function getChainBySlug(slug: string, userId?: number) {
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
                        id: true,
                        userId: true
                    }
                },
                threads: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        author: {
                            select: {
                                username: true
                            }
                        }
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
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

        if (!chain) {
            return null;
        }

        // Add user-specific membership information
            const isMember = userId ? chain.members.some((member) => member.userId === userId) : false;
        const isCreator = userId ? chain.creator.id === userId : false;

        return {
            ...chain,
            isMember,
            isCreator
        };
    } catch (error) {
        console.error("Error fetching chain:", error);
        return null;
    }
}
