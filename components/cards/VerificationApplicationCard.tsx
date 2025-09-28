"use client"
import { useState } from "react";
import { approveVerification, rejectVerification } from "@/actions/adminVerification";
import { useTransition } from "react";
import { toast } from "react-toastify";

interface VerificationApplicationCardProps {
    application: {
        id: number;
        fullname: string;
        dob: string;
        schoolName: string;
        schoolEmail: string | null;
        documentUrl: string;
        status: string;
        remarks: string | null;
        createdAt: Date;
        user: {
            id: number;
            username: string;
            email: string | null;
            createdAt: Date;
        };
        referralCode: {
            id: number;
            code: string;
            creator: {
                username: string;
            };
        } | null;
    };
}

export default function VerificationApplicationCard({ application }: VerificationApplicationCardProps) {
    const [showRemarks, setShowRemarks] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveVerification(application.id);
            if (result?.success) {
                toast.success("Application approved successfully!");
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleReject = () => {
        if (!remarks.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }
        startTransition(async () => {
            const result = await rejectVerification({ applicationId: application.id, remarks });
            if (result?.success) {
                toast.success("Application rejected successfully!");
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="card">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{application.fullname}</h3>
                    <p className="info">Username: {application.user.username}</p>
                    <p className="info">Email: {application.user.email || "Not provided"}</p>
                </div>
                <div className="text-right">
                    <p className="info">Applied: {new Date(application.createdAt).toLocaleDateString()}</p>
                    <p className="info">Status: {application.status}</p>
                </div>
            </div>

            <div className="mb-4">
                <p><strong>School:</strong> {application.schoolName}</p>
                <p><strong>Date of Birth:</strong> {application.dob}</p>
                {application.schoolEmail && (
                    <p><strong>School Email:</strong> {application.schoolEmail}</p>
                )}
                {application.referralCode && (
                    <p><strong>Referral Code:</strong> {application.referralCode.code} (by {application.referralCode.creator.username})</p>
                )}
            </div>

            <div className="mb-4">
                <p><strong>Document:</strong></p>
                <a 
                    href={application.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link"
                >
                    View Document
                </a>
            </div>

            {application.remarks && (
                <div className="mb-4">
                    <p><strong>Admin Remarks:</strong> {application.remarks}</p>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={handleApprove}
                    disabled={isPending}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {isPending ? "Approving..." : "Approve"}
                </button>
                
                <button
                    onClick={() => setShowRemarks(!showRemarks)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                    {showRemarks ? "Cancel" : "Reject"}
                </button>
            </div>

            {showRemarks && (
                <div className="mt-4 p-4 border rounded">
                    <label htmlFor="remarks" className="block mb-2">
                        Reason for rejection:
                    </label>
                    <textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleReject}
                            disabled={isPending || !remarks.trim()}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {isPending ? "Rejecting..." : "Confirm Rejection"}
                        </button>
                        <button
                            onClick={() => {
                                setShowRemarks(false);
                                setRemarks("");
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
