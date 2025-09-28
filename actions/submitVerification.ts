"use server"
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { validateReferralCode } from "@/actions/referralActions";

export async function submitVerification(formData: FormData) {
    const sessionId = (await cookies()).get("sessionId")?.value;
    
    if (!sessionId) {
        return { error: "You must be logged in to submit verification" };
    }

    const session = await getSession(sessionId);
    if (!session) {
        return { error: "Invalid session. Please log in again." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, isVerified: true, verification: true }
    });

    if (!user) {
        return { error: "User not found" };
    }

    if (user.isVerified) {
        return { error: "You are already verified" };
    }

    if (user.verification) {
        return { error: "You already have a pending verification request" };
    }

    const fullname = formData.get("name") as string;
    const schoolName = formData.get("school") as string;
    const schoolEmail = formData.get("email") as string;
    const dob = formData.get("dob") as string;
    const document = formData.get("document") as File;
    const referralCode = formData.get("ref") as string;
    const studentConfirm = formData.get("student_confirm");

    if (!studentConfirm) {
        return { error: "You must confirm that you are a student" };
    }

    if (!fullname || !schoolName || !dob || !document) {
        return { error: "All required fields must be filled" };
    }

    try {
        const documentUrl = `uploads/verification/${user.id}_${Date.now()}_${document.name}`;

        // Validate referral code
        let referralCodeId = null;
        if (referralCode) {
            const validation = await validateReferralCode(referralCode);
            if (validation.valid && validation.referralCode) {
                referralCodeId = validation.referralCode.id;
            } else {
                return { error: validation.error || "Invalid referral code" };
            }
        }

        // Create verification request
        await prisma.verificationRequest.create({
            data: {
                userId: user.id,
                fullname,
                dob,
                schoolName,
                schoolEmail: schoolEmail || null,
                documentUrl,
                referralCodeId,
                geoData: "Unknown", // You might want to get this from the request
                time: new Date().toISOString()
            }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Verification submission error:", err);
        return { error: "Failed to submit verification. Please try again." };
    }
}
