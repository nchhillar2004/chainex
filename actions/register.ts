"use server"
import prisma from "@/lib/db";
import { RegisterFormState, RegisterationFormSchema } from "@/lib/definitions";
import { getUserLocation } from "@/utils/location";
import { getCurrentTime } from "@/utils/time";
import bcrypt from "bcryptjs";

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

    if (email) {
        const exists = await prisma.user.findFirst({
            where: { email: email }
        })

        if (exists) {
            throw new Error("Email already registered");
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const { geoData, country, timezone } = await getUserLocation();
    const time = getCurrentTime();

    try{
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                geoData: geoData,
                country: country,
                timezone: timezone,
                time: time
            },
        });

        return { message: "User registered successfully", userId: user.id };
    } catch (err: any) {
        if (err.code === "P2002") {
            return { errors: { username: ["Username or email already exists"] } };
        }
        throw err;
    }

}
