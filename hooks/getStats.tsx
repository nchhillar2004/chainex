import prisma from "@/lib/db";

export async function getTotalUser(){
    const count = await prisma.user.count()

    return count;
}

export async function getTotalChains(){
    const count = await prisma.chain.count();

    return count;
}

export async function getTotalThreads(){
    const count = await prisma.thread.count();

    return count;
}
