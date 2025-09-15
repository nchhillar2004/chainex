import { z } from "zod";

export const LoginFormSchema = z.object({
    username: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{3,16}$/, { error: "Incorrect username" })
    .trim(),
    password: z
    .string()
    .min(8, { error: "Incorrect password" })
    .trim(),
})

export type LoginFormState = | { error?: string } | undefined;

export const RegisterationFormSchema = z.object({
    username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters long" })
    .max(16, { error: "Username can contain at most 16 characters" })
    .regex(/^[a-zA-Z0-9_-]{3,16}$/, { error: "No special symbols are allowed except underscores and hyphens" })
    .trim(),
    email: z.union([z.email({ error: "Please enter a valid email address" }), z.literal("")]).optional(),
    password: z
    .string()
    .min(8, { error: "Be at least 8 characters long" })
    .trim(),
    cpassword: z
    .string()
    .min(8, { error: "Passwords do not match" })
    .trim(),
})
.refine((data) => data.password === data.cpassword, {
    error: "Passwords do not match",
    path: ["cpassword"],
});

export type RegisterFormState = 
| {
    errors?: {
        username?: string[]
        email?: string[]
        password?: string[]
        cpassword?: string[]
    }
} | undefined
