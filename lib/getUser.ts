import prisma from "@/lib/db";

export async function getUserByUsername(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                communitiesCreated: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        _count: {
                            select: {
                                members: true,
                                threads: true
                            }
                        }
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                threads: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        chain: {
                            select: {
                                name: true,
                                slug: true
                            }
                        },
                        _count: {
                            select: {
                                votes: true,
                                replies: true
                            }
                        }
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                followsAsFollower: {
                    select: {
                        followed: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                isVerified: true,
                                level: true
                            }
                        }
                    },
                    take: 20
                },
                followsAsFollowed: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                avatarUrl: true,
                                isVerified: true,
                                level: true
                            }
                        }
                    },
                    take: 20
                },
                userBadges: {
                    include: {
                        badge: true
                    }
                },
                _count: {
                    select: {
                        communitiesCreated: true,
                        threads: true,
                        followsAsFollower: true,
                        followsAsFollowed: true
                    }
                }
            }
        });

        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function getUserById(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                avatarUrl: true,
                bio: true,
                isVerified: true,
                level: true,
                experience: true,
                role: true,
                status: true,
                createdAt: true,
                country: true,
                timezone: true
            }
        });

        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}
