// Data Access Layer (DAL)
"use server"
import { cookies } from 'next/headers'
import { getSession } from './session';

export async function verifySession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) return null;

    const session = await getSession(sessionId);

    if (!session) return null;

    return { isAuth: true, userId: session.userId };
};
