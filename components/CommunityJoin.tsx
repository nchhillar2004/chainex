"use client"
import { useState, useTransition, useEffect } from "react";
import { joinCommunity, leaveCommunity, checkEligibility } from "@/actions/communityActions";
import { toast } from "react-toastify";
import { FaUserPlus, FaUserMinus } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

interface CommunityJoinProps {
    chainId: number;
    chainName: string;
    isMember: boolean;
    isCreator: boolean;
    currentUser: {
        id: number;
        username: string;
        role: string;
        level: number;
        isVerified: boolean;
    } | null;
}

export default function CommunityJoin({ chainId, chainName, isMember, isCreator, currentUser }: CommunityJoinProps) {
    const [isPending, startTransition] = useTransition();
    const [eligibility, setEligibility] = useState<{
        eligible: boolean;
        reason: string;
        criteria: string[];
        isMember?: boolean;
        isCreator?: boolean;
    } | null>(null);

    useEffect(() => {
        if (currentUser && !isCreator) {
            checkEligibility(chainId).then(setEligibility);
        }
    }, [chainId, currentUser, isCreator]);

    const handleJoin = () => {
        if (!currentUser) {
            toast.error("You must be logged in to join communities");
            return;
        }

        startTransition(async () => {
            const result = await joinCommunity(chainId);
            if (result?.success) {
                toast.success(`Successfully joined ${chainName}!`);
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleLeave = () => {
        if (!currentUser) {
            toast.error("You must be logged in to leave communities");
            return;
        }

        startTransition(async () => {
            const result = await leaveCommunity(chainId);
            if (result?.success) {
                toast.success(`Left ${chainName}`);
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    if (!currentUser) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Join Community</h3>
                <p className="info mb-4">You must be logged in to join this community.</p>
                <a href="/auth/login" className="link">
                    Login to join
                </a>
            </div>
        );
    }

    if (isCreator) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Community Owner</h3>
                <p className="info">You are the creator of this community.</p>
            </div>
        );
    }

    if (isMember) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Community Member</h3>
                <p className="info mb-4">You are a member of this community.</p>
                <button
                    onClick={handleLeave}
                    disabled={isPending}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                >
                    <FaUserMinus size={16} />
                    <span>{isPending ? "Leaving..." : "Leave Community"}</span>
                </button>
            </div>
        );
    }

    if (!eligibility) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Join Community</h3>
                <p className="info">Checking eligibility...</p>
            </div>
        );
    }

    if (eligibility.eligible) {
        return (
            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Join Community</h3>
                <p className="info mb-4">You are eligible to join this community!</p>
                <button
                    onClick={handleJoin}
                    disabled={isPending}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                    <FaUserPlus size={16} />
                    <span>{isPending ? "Joining..." : "Join Community"}</span>
                </button>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold mb-4">Join Community</h3>
            <div className="border border-red-200 rounded-lg p-4 mb-4" style={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)'}}>
                <div className="flex items-center space-x-2 mb-2">
                    <FaExclamationTriangle className="text-red-600" size={16} />
                    <span className="font-medium" style={{color: 'var(--text-color)'}}>Not Eligible</span>
                </div>
                <p style={{color: 'var(--text-color)'}}>{eligibility.reason}</p>
                {eligibility.reason.includes("verified") && (
                    <div className="mt-3">
                        <Link
                            href={"/auth/verify"} 
                        >
                            Get Verified Now
                        </Link>
                    </div>
                )}
            </div>
            
            {eligibility.criteria.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium mb-2" style={{color: 'var(--text-color)'}}>Requirements to join:</h4>
                    <ul className="list-disc list-inside space-y-1" style={{color: 'var(--text-color)'}}>
                        {eligibility.criteria.map((criterion, index) => (
                            <li key={index}>
                                {criterion.includes("verified") ? (
                                    <span>
                                        Be verified (required for age-restricted communities)                                    </span>
                                ) : (
                                    criterion
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <button
                disabled={true}
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed flex items-center space-x-2"
            >
                <FaUserPlus size={16} />
                <span>Join Community</span>
            </button>
        </div>
    );
}
