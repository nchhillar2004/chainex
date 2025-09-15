"use server"
import prisma from "@/lib/db";
import { LoginFormSchema, LoginFormState } from "@/lib/definitions"
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";

export async function login(state: LoginFormState, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return { error: "Incorrect username or password" };
    }

    const { username, password } = validatedFields.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })

        if (!user) {
            return { error: "Incorrect username or password" }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return { error: "Incorrect username or password" }
        }

        const sessionId = await createSession(user.id);

        const cookieStore = await cookies()
        cookieStore.set("sessionId", sessionId, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            path: "/",
        })

        return { message: "User logged in successfully", user: user };
    } catch (err: any) {
        throw err;
    }
}
