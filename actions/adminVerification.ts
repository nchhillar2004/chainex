"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { addXP } from "@/actions/xpActions";
import { XP_REWARDS } from "@/lib/xpConstants";
import { generateReferralCodeForUser, useReferralCode } from "@/actions/referralActions";

export async function approveVerification(applicationId: number) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    });

    if (!user || user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // Get the verification request
        const verificationRequest = await prisma.verificationRequest.findUnique({
            where: { id: applicationId },
            include: { user: true }
        });

        if (!verificationRequest) {
            return { error: "Verification request not found" };
        }

        if (verificationRequest.status !== "PENDING") {
            return { error: "This application has already been processed" };
        }

        // Update verification request status
        await prisma.verificationRequest.update({
            where: { id: applicationId },
            data: { status: "APPROVED" }
        });

        // Update user verification status
        await prisma.user.update({
            where: { id: verificationRequest.userId },
            data: { isVerified: true }
        });

        // Give XP for verification completion
        await addXP(verificationRequest.userId, XP_REWARDS.VERIFICATION_COMPLETED, "VERIFICATION_COMPLETED");

        // Handle referral code usage if applicable
        if (verificationRequest.referralCodeId) {
            const referralCode = await prisma.referralCode.findUnique({
                where: { id: verificationRequest.referralCodeId },
                select: { code: true }
            });
            
            if (referralCode) {
                await useReferralCode(referralCode.code, verificationRequest.userId);
            }
        }

        // Auto-generate referral code for newly verified user
        await generateReferralCodeForUser(verificationRequest.userId);

        return { success: true };
    } catch (err: any) {
        console.error("Approval error:", err);
        return { error: "Failed to approve verification" };
    }
}

export async function rejectVerification(data: { applicationId: number; remarks: string }) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    });

    if (!user || user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const verificationRequest = await prisma.verificationRequest.findUnique({
            where: { id: data.applicationId }
        });

        if (!verificationRequest) {
            return { error: "Verification request not found" };
        }

        if (verificationRequest.status !== "PENDING") {
            return { error: "This application has already been processed" };
        }

        // Update verification request status with remarks
        await prisma.verificationRequest.update({
            where: { id: data.applicationId },
            data: { 
                status: "REJECTED",
                remarks: data.remarks
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Rejection error:", err);
        return { error: "Failed to reject verification" };
    }
}
