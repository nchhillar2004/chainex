"use client"
import { useState, useTransition } from "react";
import { banUserFromCommunity, unbanUserFromCommunity, deleteUserPost } from "@/actions/userActions";
import { toast } from "react-toastify";
import { FaBan, FaTrash } from "react-icons/fa6";
import UsernameDisplay from "@/components/UsernameDisplay";

interface CommunityModerationProps {
    chainId: number;
    isOwner: boolean;
    isAdmin: boolean;
    threads: {
        id: number;
        title: string;
        author: {
            id: number;
            username: string;
            level: number;
            isVerified: boolean;
            role: string;
        };
        createdAt: Date;
    }[];
    members: {
        id: number;
        username: string;
        level: number;
        isVerified: boolean;
        role: string;
    }[];
}

export default function CommunityModeration({ chainId, isOwner, isAdmin, threads, members }: CommunityModerationProps) {
    const [banReason, setBanReason] = useState("");
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const canModerate = isOwner || isAdmin;

    if (!canModerate) {
        return null;
    }

    const handleBanUser = (userId: number) => {
        if (!banReason.trim()) {
            toast.error("Please provide a reason for banning");
            return;
        }

        startTransition(async () => {
            const result = await banUserFromCommunity({
                userId,
                chainId,
                reason: banReason
            });
            
            if (result?.success) {
                toast.success("User banned successfully");
                setBanReason("");
                setSelectedUser(null);
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };


    const handleDeletePost = (postId: number) => {
        startTransition(async () => {
            const result = await deleteUserPost(postId);
            
            if (result?.success) {
                toast.success("Post deleted successfully");
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Community Members */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Community Members</h2>
                <div className="space-y-2">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                                <UsernameDisplay
                                    username={member.username}
                                    level={member.level}
                                    isVerified={member.isVerified}
                                    role={member.role}
                                    size="sm"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSelectedUser(member.id)}
                                    className="text-red-600 hover:text-red-800 p-2"
                                    title="Ban User"
                                >
                                    <FaBan size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
                <div className="space-y-2">
                    {threads.map((thread) => (
                        <div key={thread.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-medium">{thread.title}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>by</span>
                                    <UsernameDisplay
                                        username={thread.author.username}
                                        level={thread.author.level}
                                        isVerified={thread.author.isVerified}
                                        role={thread.author.role}
                                        size="sm"
                                    />
                                    <span>• {new Date(thread.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeletePost(thread.id)}
                                className="text-red-600 hover:text-red-800 p-2"
                                title="Delete Post"
                            >
                                <FaTrash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ban User Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Ban User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Reason for banning:
                                </label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    placeholder="Enter reason for banning this user..."
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBanUser(selectedUser)}
                                    disabled={isPending || !banReason.trim()}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isPending ? "Banning..." : "Ban User"}
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setBanReason("");
                                    }}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
