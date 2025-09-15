// Data Access Layer (DAL)
"use server"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { getSession } from './session';

export async function verifySession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
        redirect("/auth/login");
    }
    
    const session = await getSession(sessionId);

    return { isAuth: true, userId: session.userId };
};
