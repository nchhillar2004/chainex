"use client"
import { useState, useTransition } from "react";
import Link from "next/link";
import { FaCaretUp, FaCaretDown, FaThumbtack } from "react-icons/fa6";
import { voteThread, pinThread, createReply } from "@/actions/threadActions";
import { toast } from "react-toastify";
import { formatISO } from "@/utils/time";
import UsernameDisplay from "@/components/UsernameDisplay";

interface ThreadDetailProps {
    thread: {
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        author: {
            id: number;
            username: string;
            avatarUrl: string | null;
            isVerified: boolean;
            level: number;
            role: string;
        };
        chain: {
            id: number;
            name: string;
            slug: string;
            creator: {
                id: number;
                username: string;
            };
        };
        replies: {
            id: number;
            content: string;
            createdAt: Date;
            author: {
                id: number;
                username: string;
                avatarUrl: string | null;
                isVerified: boolean;
                level: number;
                role: string;
            };
            votes: {
                userId: number;
                voteType: string;
            }[];
            _count: {
                votes: number;
            };
        }[];
        votes: {
            userId: number;
            voteType: string;
        }[];
        threadTags: {
            tag: {
                id: number;
                name: string;
            };
        }[];
        _count: {
            votes: number;
            replies: number;
        };
    };
    currentUser: {
        id: number;
        username: string;
        role: string;
    } | null;
}

export default function ThreadDetail({ thread, currentUser }: ThreadDetailProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const [userVote, setUserVote] = useState(
        currentUser ? thread.votes.find(v => v.userId === currentUser.id)?.voteType : null
    );
    const [voteCount, setVoteCount] = useState(thread._count.votes);

    const handleVote = (voteType: 'UP' | 'DOWN') => {
        if (!currentUser) {
            toast.error("You must be logged in to vote");
            return;
        }

        startTransition(async () => {
            const result = await voteThread(thread.id, voteType);
            if (result?.success) {
                if (result.voted) {
                    setVoteCount(prev => prev + 1);
                    setUserVote(voteType);
                } else {
                    setVoteCount(prev => prev - 1);
                    setUserVote(null);
                }
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handlePin = () => {
        if (!currentUser || currentUser.role !== "ADMIN" && currentUser.id !== thread.chain?.creator?.id) {
            toast.error("Only chain creators can pin threads");
            return;
        }

        startTransition(async () => {
            const result = await pinThread(thread.id);
            if (result?.success) {
                toast.success(result.pinned ? "Thread pinned" : "Thread unpinned");
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const handleReply = () => {
        if (!currentUser) {
            toast.error("You must be logged in to reply");
            return;
        }

        if (!replyContent.trim()) {
            toast.error("Reply content cannot be empty");
            return;
        }

        startTransition(async () => {
            const result = await createReply(thread.id, replyContent);
            if (result?.success) {
                toast.success("Reply posted successfully!");
                setReplyContent("");
                setShowReplyForm(false);
                window.location.reload(); // Refresh to show new reply
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    const canPin = currentUser && (currentUser.role === "ADMIN" || currentUser.id === thread.chain?.creator?.id);

    return (
        <div className="space-y-4">
            {/* Thread Header */}
            <div className="card">
                <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center space-y-1">
                        <FaCaretUp 
                            size={24} 
                            title="upvote" 
                            className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userVote === 'UP' ? 'text-[var(--link)]' : ''}`}
                            onClick={() => handleVote('UP')}
                        />
                        <div className="text-xl font-bold">{voteCount}</div>
                        <FaCaretDown 
                            size={24} 
                            title="downvote" 
                            className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userVote === 'DOWN' ? 'text-[var(--link)]' : ''}`}
                            onClick={() => handleVote('DOWN')}
                        />
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h1 className="text-2xl font-bold">{thread.title}</h1>
                            {canPin && (
                                <button
                                    onClick={handlePin}
                                    className="text-yellow-600 hover:text-yellow-800"
                                    title="Pin/Unpin thread"
                                >
                                    <FaThumbtack size={16} />
                                </button>
                            )}
                        </div>
                        
                        <div className="info mb-4">
                            Posted by <Link href={`/u/${thread.author.username}`} className="link">
                                <UsernameDisplay 
                                    username={thread.author.username}
                                    level={thread.author.level}
                                    isVerified={thread.author.isVerified}
                                    role={thread.author.role}
                                    size="sm"
                                />
                            </Link> in <Link href={`/c/${thread.chain?.slug || 'unknown'}`} className="link">c/{thread.chain?.slug || 'unknown'}</Link> • {formatISO(thread.createdAt.toISOString())} (IST)
                        </div>
                        
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{thread.content}</p>
                        </div>
                        
                        {thread.threadTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {thread.threadTags.map((threadTag) => (
                                    <span
                                        key={threadTag.tag.id}
                                        className="px-2 py-1"
                                        style={{ backgroundColor: 'var(--button)', color: 'var(--link)' }}
                                    >
                                        #{threadTag.tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply Form */}
            {currentUser && (
                <div className="card">
                    <h3>Reply to Thread</h3>
                    {!showReplyForm ? (
                        <button
                            onClick={() => setShowReplyForm(true)}
                            className="mt-2"
                        >
                            Write a Reply
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                                rows={4}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleReply}
                                    disabled={isPending || !replyContent.trim()}
                                >
                                    {isPending ? "Posting..." : "Post Reply"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyContent("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Replies */}
            <div className="space-y-4">
                <h3>{thread._count.replies} Replies</h3>
                {thread.replies.map((reply) => (
                    <div key={reply.id} className="card">
                        <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center space-y-1">
                                <FaCaretUp size={20} className="cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1" />
                                <div className="text-sm font-bold">{reply._count.votes}</div>
                                <FaCaretDown size={20} className="cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1" />
                            </div>
                            
                            <div className="flex-1">
                                <div className="info mb-2">
                                    <Link href={`/u/${reply.author.username}`} className="link">
                                        <UsernameDisplay 
                                            username={reply.author.username}
                                            level={reply.author.level}
                                            isVerified={reply.author.isVerified}
                                            role={reply.author.role}
                                            size="sm"
                                        />
                                    </Link> • {formatISO(reply.createdAt.toISOString())} (IST)
                                </div>
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap">{reply.content}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
