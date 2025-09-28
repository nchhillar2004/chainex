import prisma from "@/lib/db";

export async function getVerificationApplications() {
    try {
        const applications = await prisma.verificationRequest.findMany({
            where: {
                status: "PENDING"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true
                    }
                },
                referralCode: {
                    select: {
                        id: true,
                        code: true,
                        creator: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return applications;
    } catch (error) {
        console.error("Error fetching verification applications:", error);
        return [];
    }
}
