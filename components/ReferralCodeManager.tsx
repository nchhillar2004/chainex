"use client"
import { useState, useTransition, useEffect } from "react";
import { getUserReferralCode } from "@/actions/referralActions";
import { toast } from "react-toastify";
import { FaCopy, FaTrash } from "react-icons/fa6";
import Link from "next/link";

interface ReferralCodeManagerProps {
    currentUser: {
        id: number;
        username: string;
        role: string;
        level: number;
        isVerified: boolean;
    } | null;
}

export default function ReferralCodeManager({ currentUser }: ReferralCodeManagerProps) {
    const [referralCode, setReferralCode] = useState<{
        id: number;
        code: string;
        status: string;
        createdAt: Date;
        _count?: {
            verificationRequests: number;
        };
    } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [, setCopied] = useState(false);

    useEffect(() => {
        if (currentUser?.isVerified) {
            getUserReferralCode().then((result) => {
                if (result?.success && result.referralCode) {
                    setReferralCode(result.referralCode);
                }
            });
        }
    }, [currentUser]);

    // Remove create code function since codes are auto-generated

    const handleDeactivateCode = () => {
        if (!referralCode) return;

        startTransition(async () => {
            const result = await deactivateReferralCode(referralCode.id);
            if (result?.success) {
                setReferralCode(null);
                toast.success("Referral code deactivated successfully!");
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleCopyCode = () => {
        if (!referralCode) return;
        
        navigator.clipboard.writeText(referralCode.code);
        setCopied(true);
        toast.success("Referral code copied to clipboard!");
        
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    if (!currentUser) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Referral Code</h3>
                <p className="info">You must be logged in to manage referral codes.</p>
            </div>
        );
    }

    if (!currentUser.isVerified) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Referral Code</h3>
                <p className="info mb-4">Only verified users can create referral codes.</p>
                <Link href="/auth/verify" className="link">
                    Get verified to create referral codes
                </Link>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Referral Code</h3>
            
            {referralCode ? (
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800">Active Referral Code</span>
                            <span className="text-sm text-green-600">
                                Created: {new Date(referralCode.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                            <code className="px-3 py-2 rounded border text-lg font-mono">
                                {referralCode.code}
                            </code>
                            <button
                                onClick={handleCopyCode}
                                title="Copy code"
                            >
                                <FaCopy size={16} />
                            </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-green-700">
                            <span>Status: Active</span>
                            <span>Used: {referralCode._count?.verificationRequests || 0}/5 times</span>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-blue-800 mb-2">Share Your Referral Code</h4>
                        <p className="text-blue-700 mb-3">
                            Share this code with friends who want to join ChainEX. 
                            When they use it during verification, their application will be highlighted for faster processing.
                        </p>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600">Share link:</span>
                            <code className="bg-white px-2 py-1 rounded text-sm">
                                {typeof window !== 'undefined' ? window.location.origin : ''}/auth/verify?ref={referralCode.code}
                            </code>
                            <button
                                onClick={() => {
                                    const shareLink = `${window.location.origin}/auth/verify?ref=${referralCode.code}`;
                                    navigator.clipboard.writeText(shareLink);
                                    toast.success("Share link copied to clipboard!");
                                }}
                                title="Copy share link"
                            >
                                <FaCopy size={12} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        <button
                            onClick={handleDeactivateCode}
                            disabled={isPending}
                        >
                            <FaTrash size={16} />
                            <span>{isPending ? "Deactivating..." : "Deactivate Code"}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Your Referral Code</h4>
                        <p className="info mb-4">
                            Your referral code will be automatically generated when you get verified. 
                            You can invite up to 5 friends using your unique code.
                        </p>
                        <Link href="/auth/verify" className="link">
                            Get verified to receive your referral code
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
