"use server";

import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";

export async function logout() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (sessionId) {
        await deleteSession(sessionId);
        cookieStore.delete("sessionId");
    }
}

