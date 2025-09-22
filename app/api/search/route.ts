import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ error: 'Missing query' }, { status: 400 });
        }

        const q = query.trim();

        const [chains, threads, users] = await Promise.all([
            prisma.chain.findMany({
                where: {
                    name: {
                        contains: q,
                    },
                },
                take: 5,
                select: { id: true, name: true },
            }),
            prisma.thread.findMany({
                where: {
                    title: {
                        contains: q,
                    },
                },
                take: 5,
                select: { id: true, title: true },
            }),
            prisma.user.findMany({
                where: {
                    username: {
                        contains: q,
                    },
                },
                take: 5,
                select: { id: true, username: true },
            }),
        ]);

        return NextResponse.json({ chains, threads, users });
    } catch (err) {
        console.error('[API /search error]', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

