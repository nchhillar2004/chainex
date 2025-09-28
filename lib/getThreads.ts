import prisma from "@/lib/db";

export async function getThreadById(threadId: number) {
    try {
        const thread = await prisma.thread.findUnique({
            where: { id: threadId },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        isVerified: true,
                        level: true,
                        role: true
                    }
                },
                chain: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        creator: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                isVerified: true,
                                level: true,
                                role: true
                            }
                        },
                        votes: {
                            select: {
                                userId: true,
                                voteType: true
                            }
                        },
                        _count: {
                            select: {
                                votes: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                votes: {
                    select: {
                        userId: true,
                        voteType: true
                    }
                },
                threadTags: {
                    include: {
                        tag: true
                    }
                },
                _count: {
                    select: {
                        votes: true,
                        replies: true
                    }
                }
            }
        });

        return thread;
    } catch (error) {
        console.error("Error fetching thread:", error);
        return null;
    }
}

export async function getTopThreads(limit: number = 20, offset: number = 0, filter: string = 'top') {
    try {
        let orderBy: { createdAt: 'desc' } | { votes: { _count: 'desc' } } | { replies: { _count: 'desc' } } = { createdAt: 'desc' };
        
        if (filter === 'top') {
            orderBy = { votes: { _count: 'desc' } };
        } else if (filter === 'popular') {
            orderBy = { replies: { _count: 'desc' } };
        }

        const threads = await prisma.thread.findMany({
            where: {
                deletedAt: null,
                chain: {
                    visibility: "PUBLIC"
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        isVerified: true,
                        level: true,
                        role: true
                    }
                },
                chain: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                votes: {
                    select: {
                        userId: true,
                        voteType: true
                    }
                },
                threadTags: {
                    include: {
                        tag: true
                    }
                },
                pinnedThreads: {
                    select: {
                        pinnedAt: true
                    }
                },
                _count: {
                    select: {
                        votes: true,
                        replies: true
                    }
                }
            },
            orderBy,
            take: limit,
            skip: offset
        });

        return threads;
    } catch (error) {
        console.error("Error fetching threads:", error);
        return [];
    }
}

export async function getChainThreads(chainId: number, limit: number = 20, offset: number = 0) {
    try {
        const threads = await prisma.thread.findMany({
            where: {
                chainId: chainId,
                deletedAt: null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        isVerified: true,
                        level: true,
                        role: true
                    }
                },
                chain: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                votes: {
                    select: {
                        userId: true,
                        voteType: true
                    }
                },
                threadTags: {
                    include: {
                        tag: true
                    }
                },
                pinnedThreads: {
                    select: {
                        pinnedAt: true
                    }
                },
                _count: {
                    select: {
                        votes: true,
                        replies: true
                    }
                }
            },
            orderBy: [
                { pinnedThreads: { _count: 'desc' } },
                { votes: { _count: 'desc' } },
                { createdAt: 'desc' }
            ],
            take: limit,
            skip: offset
        });

        return threads;
    } catch (error) {
        console.error("Error fetching chain threads:", error);
        return [];
    }
}
