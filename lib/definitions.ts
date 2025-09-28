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

export const CreateChainFormSchema = z.object({
    name: z
        .string()
        .min(3, { error: "Chain name must be at least 3 characters long" })
        .max(50, { error: "Chain name can contain at most 50 characters" })
        .regex(/^[a-zA-Z0-9\s_-]+$/, { error: "Chain name can only contain letters, numbers, spaces, underscores, and hyphens" })
        .trim(),
    description: z
        .string()
        .max(255, { error: "Description can contain at most 255 characters" })
        .optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"], { error: "Please select a valid visibility option" }),
    postPolicy: z.enum(["VERIFIED_ONLY", "MODERATORS_ONLY", "LEVEL_BASED"], { error: "Please select a valid posting policy" }),
    minAge: z
        .string()
        .optional()
        .transform((val) => val ? parseInt(val) : undefined)
        .refine((val) => val === undefined || (val >= 13 && val <= 100), { error: "Minimum age must be between 13 and 100" }),
    maxAge: z
        .string()
        .optional()
        .transform((val) => val ? parseInt(val) : undefined)
        .refine((val) => val === undefined || (val >= 13 && val <= 100), { error: "Maximum age must be between 13 and 100" }),
    tags: z
        .string()
        .optional()
        .transform((val) => val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [])
        .refine((tags) => tags.length <= 5, { error: "You can add at most 5 tags" }),
})
.refine((data) => {
    if (data.minAge && data.maxAge && data.minAge >= data.maxAge) {
        return false;
    }
    return true;
}, {
    error: "Minimum age must be less than maximum age",
    path: ["maxAge"],
});

export type CreateChainFormState = 
| {
    error?: string
    success?: boolean
} | undefined