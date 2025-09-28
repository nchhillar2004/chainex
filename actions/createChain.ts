"use server"
import prisma from "@/lib/db";
import { CreateChainFormSchema, CreateChainFormState } from "@/lib/definitions";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { addXP } from "@/actions/xpActions";
import { XP_REWARDS } from "@/lib/xpConstants";

export async function createChain(state: CreateChainFormState, formData: FormData) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to create a chain" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session. Please log in again." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, isVerified: true, role: true }
    });

    if (!user) {
        return { error: "User not found" };
    }

    if (!user.isVerified && user.role !== "ADMIN") {
        return { error: "You must be verified to create a chain" };
    }

    const validatedFields = CreateChainFormSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        visibility: formData.get("visibility"),
        postPolicy: formData.get("postPolicy"),
        minAge: formData.get("minAge"),
        maxAge: formData.get("maxAge"),
        tags: formData.get("tags"),
    });

    if (!validatedFields.success) {
        const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0];
        return { error: firstError?.[0] || "Invalid form data" };
    }

    const { name, description, visibility, postPolicy, minAge, maxAge, tags } = validatedFields.data;

    try {
        // Generate slug from name - preserve capital letters and replace spaces with hyphens
        const slug = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').replace(/^-+|-+$/g, '');

        // Check if chain name or slug already exists
        const existingChain = await prisma.chain.findFirst({
            where: {
                OR: [
                    { name: name },
                    { slug: slug }
                ]
            }
        });

        if (existingChain) {
            return { error: "A chain with this name already exists" };
        }

        // Create the chain
        const chain = await prisma.chain.create({
            data: {
                name,
                description: description || null,
                creatorId: user.id,
                visibility: visibility as "PUBLIC" | "PRIVATE",
                postPolicy: postPolicy as "VERIFIED_ONLY" | "MODERATORS_ONLY" | "LEVEL_BASED",
                minAge: minAge || null,
                maxAge: maxAge || null,
                isPrivate: visibility === "PRIVATE",
                slug: slug,
            }
        });

        // Give XP for creating a chain
        await addXP(user.id, XP_REWARDS.CHAIN_CREATED, "CHAIN_CREATED");

        // Add tags if provided
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                // Find or create tag
                const tag = await prisma.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName }
                });

                // Connect tag to chain
                await prisma.chainTag.create({
                    data: {
                        chainId: chain.id,
                        tagId: tag.id
                    }
                });
            }
        }

        // Add creator as first member
        await prisma.chainMember.create({
            data: {
                userId: user.id,
                chainId: chain.id
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Chain creation error:", err);
        return { error: "Failed to create chain. Please try again." };
    }
}
