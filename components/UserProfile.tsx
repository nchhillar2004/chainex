"use client"
import { useState, useTransition } from "react";
import { followUser, unfollowUser, deleteUserPost, deleteUserCommunity } from "@/actions/userActions";
import { toast } from "react-toastify";
import { formatISO } from "@/utils/time";
import Link from "next/link";
import { FaUserCheck, FaUserPlus, FaUserMinus, FaTrash, FaCrown } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import ReferralCodeManager from "@/components/ReferralCodeManager";

interface UserProfileProps {
    user: {
        id: number;
        username: string;
        email: string | null;
        fullname: string | null;
        avatarUrl: string | null;
        bio: string | null;
        isVerified: boolean;
        level: number;
        experience: number;
        role: string;
        status: string;
        createdAt: Date;
        country: string;
        timezone: string;
        communitiesCreated: {
            id: number;
            name: string;
            slug: string;
            description: string | null;
            _count: {
                members: number;
                threads: number;
            };
        }[];
        threads: {
            id: number;
            title: string;
            createdAt: Date;
            chain: {
                name: string;
                slug: string;
            };
            _count: {
                votes: number;
                replies: number;
            };
        }[];
        followsAsFollower: {
            followed: {
                id: number;
                username: string;
                avatarUrl: string | null;
                isVerified: boolean;
                level: number;
            };
        }[];
        followsAsFollowed: {
            follower: {
                id: number;
                username: string;
                avatarUrl: string | null;
                isVerified: boolean;
                level: number;
            };
        }[];
        userBadges: {
            badge: {
                id: number;
                name: string;
                description: string | null;
            };
        }[];
        _count: {
            communitiesCreated: number;
            threads: number;
            followsAsFollower: number;
            followsAsFollowed: number;
        };
    };
    currentUser: {
        id: number;
        username: string;
        role: string;
        level: number;
        isVerified: boolean;
    } | null;
}

export default function UserProfile({ user, currentUser }: UserProfileProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        if (!currentUser) {
            toast.error("You must be logged in to follow users");
            return;
        }

        if (currentUser.id === user.id) {
            toast.error("You cannot follow yourself");
            return;
        }

        startTransition(async () => {
            const result = await followUser(user.id);
            if (result?.success) {
                setIsFollowing(true);
                toast.success(`Now following ${user.username}`);
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleUnfollow = () => {
        if (!currentUser) {
            toast.error("You must be logged in to unfollow users");
            return;
        }

        startTransition(async () => {
            const result = await unfollowUser(user.id);
            if (result?.success) {
                setIsFollowing(false);
                toast.success(`Unfollowed ${user.username}`);
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleDeletePost = (postId: number) => {
        if (!currentUser) {
            toast.error("You must be logged in to delete posts");
            return;
        }

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

    const handleDeleteCommunity = (communityId: number) => {
        if (!currentUser) {
            toast.error("You must be logged in to delete communities");
            return;
        }

        startTransition(async () => {
            const result = await deleteUserCommunity(communityId);
            if (result?.success) {
                toast.success("Community deleted successfully");
                window.location.reload();
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const getUsernameColor = (level: number) => {
        if (level >= 100) return "text-red-600";
        if (level >= 50) return "text-orange-600";
        if (level >= 25) return "text-green-600";
        if (level >= 10) return "text-yellow-600";
        return "";
    };

        const canDeletePost = (post: { authorId: number }) => {
        return currentUser && (currentUser.id === user.id || currentUser.role === "ADMIN");
    };

    const canDeleteCommunity = (community: { creatorId: number }) => {
        return currentUser && (currentUser.id === user.id || currentUser.role === "ADMIN");
    };

    return (
        <div className="space-y-6">
            {/* User Header */}
            <div className="card">
                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className={`text-3xl font-bold ${getUsernameColor(user.level)}`}>
                            {user.level>=100 ? <span><span className="text-[var(--text-color)]!">{user.username.charAt(0)}</span>{user.username.substring(1)}</span>: user.username}
                            </h1>
                            {user.isVerified && (
                                <FaUserCheck className="text-blue-600" size={24} title="Verified User" />
                            )}
                            {user.role === "ADMIN" && (
                                <FaCrown className="text-yellow-600" size={24} title="Administrator" />
                            )}
                            {user.role === "MODERATOR" && (
                                <FaShieldAlt className="text-green-600" size={24} title="Moderator" />
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                Level {user.level}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                {user.experience} XP
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {user._count.threads} Posts
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                {user._count.communitiesCreated} Communities
                            </span>
                        </div>
                        
                        {user.fullname && (
                            <p className="text-lg text-gray-600 mb-2">{user.fullname}</p>
                        )}
                        
                        {user.bio && (
                            <p className="text-gray-700 mb-4">{user.bio}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Joined: {formatISO(user.createdAt.toISOString())} (IST)</span>
                            <span>Country: {user.country}</span>
                        </div>
                        
                        {/* Follow Button */}
                        {currentUser && currentUser.id !== user.id && (
                            <div className="mt-4">
                                {isFollowing ? (
                                    <button
                                        onClick={handleUnfollow}
                                        disabled={isPending}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        <FaUserMinus size={16} />
                                        <span>Unfollow</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        disabled={isPending}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        <FaUserPlus size={16} />
                                        <span>Follow</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Badges */}
            {user.userBadges.length > 0 && (
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Badges</h2>
                    <div className="flex flex-wrap gap-2">
                        {user.userBadges.map((userBadge) => (
                            <div
                                key={userBadge.badge.id}
                                className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                                title={userBadge.badge.description || ""}
                            >
                                {userBadge.badge.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Referral Code Manager */}
            <ReferralCodeManager currentUser={currentUser} />

            {/* Followers and Following */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">
                        Followers ({user._count.followsAsFollowed})
                    </h2>
                    {user.followsAsFollowed.length === 0 ? (
                        <p className="text-gray-500">No followers yet</p>
                    ) : (
                        <div className="space-y-2">
                            {user.followsAsFollowed.map((follow) => (
                                <div key={follow.follower.id} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                                        {follow.follower.username.charAt(0).toUpperCase()}
                                    </div>
                                    <Link
                                        href={`/u/${follow.follower.username}`}
                                        className={`font-medium ${getUsernameColor(follow.follower.level)}`}
                                    >
                                        {follow.follower.username}
                                    </Link>
                                    {follow.follower.isVerified && (
                                        <FaUserCheck className="text-blue-600" size={14} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">
                        Following ({user._count.followsAsFollower})
                    </h2>
                    {user.followsAsFollower.length === 0 ? (
                        <p className="text-gray-500">Not following anyone yet</p>
                    ) : (
                        <div className="space-y-2">
                            {user.followsAsFollower.map((follow) => (
                                <div key={follow.followed.id} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                                        {follow.followed.username.charAt(0).toUpperCase()}
                                    </div>
                                    <Link
                                        href={`/u/${follow.followed.username}`}
                                        className={`font-medium ${getUsernameColor(follow.followed.level)}`}
                                    >
                                        {follow.followed.username}
                                    </Link>
                                    {follow.followed.isVerified && (
                                        <FaUserCheck className="text-blue-600" size={14} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Communities Created */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">
                    Communities Created ({user._count.communitiesCreated})
                </h2>
                {user.communitiesCreated.length === 0 ? (
                    <p className="text-gray-500">No communities created yet</p>
                ) : (
                    <div className="space-y-4">
                        {user.communitiesCreated.map((community) => (
                            <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <Link
                                        href={`/c/${community.slug}`}
                                        className="text-lg font-semibold link"
                                    >
                                        c/{community.slug}: {community.name}
                                    </Link>
                                    {community.description && (
                                        <p className="text-gray-600 mt-1">{community.description}</p>
                                    )}
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span>{community._count.members} members</span>
                                        <span>{community._count.threads} threads</span>
                                    </div>
                                </div>
                                {canDeleteCommunity(community) && (
                                    <button
                                        onClick={() => handleDeleteCommunity(community.id)}
                                        disabled={isPending}
                                        className="text-red-600 hover:text-red-800 p-2"
                                        title="Delete Community"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Posts */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">
                    Recent Posts ({user._count.threads})
                </h2>
                {user.threads.length === 0 ? (
                    <p className="text-gray-500">No posts yet</p>
                ) : (
                    <div className="space-y-4">
                        {user.threads.map((thread) => (
                            <div key={thread.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <Link
                                        href={`/c/${thread.chain.slug}/thread/${thread.id}`}
                                        className="text-lg font-semibold link"
                                    >
                                        {thread.title}
                                    </Link>
                                    <p className="text-gray-600 mt-1">
                                        in <Link href={`/c/${thread.chain.slug}`} className="link">c/{thread.chain.slug}</Link>
                                    </p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                        <span>{formatISO(thread.createdAt.toISOString())} (IST)</span>
                                        <span>{thread._count.votes} votes</span>
                                        <span>{thread._count.replies} replies</span>
                                    </div>
                                </div>
                                {canDeletePost(thread) && (
                                    <button
                                        onClick={() => handleDeletePost(thread.id)}
                                        disabled={isPending}
                                        className="text-red-600 hover:text-red-800 p-2"
                                        title="Delete Post"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
