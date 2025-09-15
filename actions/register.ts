"use server"
import prisma from "@/lib/db";
import { RegisterFormState, RegisterationFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
import { getUserLocation } from "@/utils/location";
import { getCurrentTime } from "@/utils/time";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(state: RegisterFormState, formData: FormData) {
    const validatedFields = RegisterationFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        cpassword: formData.get("cpassword"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { username, email, password } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10)
    const location = await getUserLocation();
    const time = getCurrentTime();

    try{
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email ?? null,
                password: hashedPassword,
                ip: location,
                time: time
            },
        });

        const sessionId = await createSession(user.id);

        const cookieStore = await cookies()
        cookieStore.set("sessionId", sessionId, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            path: "/",
        })

        return { message: "User registered successfully", userId: user.id };
    } catch (err: any) {
        if (err.code === "P2002") {
            return { errors: { username: ["Username or email already exists"] } };
        }
        throw err;
    }

}
