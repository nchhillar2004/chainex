import { verifySession } from "@/lib/dal";
import prisma from "@/lib/db";

export async function getCurrentUser() {
    const session = await verifySession();

    return getUserById(session.userId);
};

export async function getUserById(userId: number) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (!user) return null;
    return user;
}
