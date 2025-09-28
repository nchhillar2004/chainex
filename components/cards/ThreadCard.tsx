"use client"
import { useState, useTransition } from "react";
import Link from "next/link";
import { FaCaretUp, FaCaretDown, FaThumbtack } from "react-icons/fa6";
import { voteThread } from "@/actions/threadActions";
import { toast } from "react-toastify";
import { formatISO } from "@/utils/time";
import UsernameDisplay from "@/components/UsernameDisplay";

interface ThreadCardProps {
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
        };
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
        pinnedThreads?: {
            pinnedAt: Date;
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

export default function ThreadCard({ thread, currentUser }: ThreadCardProps) {
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

    const isPinned = thread.pinnedThreads && thread.pinnedThreads.length > 0;

    return (
        <div className={`card ${isPinned ? 'border-l-4 border-yellow-500' : ''}`}>
            <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-1">
                    <FaCaretUp 
                        size={20} 
                        title="upvote" 
                        className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userVote === 'UP' ? 'text-[var(--link)]' : ''}`}
                        onClick={() => handleVote('UP')}
                    />
                    <div className="text-lg font-bold">{voteCount}</div>
                    <FaCaretDown 
                        size={20} 
                        title="downvote" 
                        className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userVote === 'DOWN' ? 'text-[var(--link)]' : ''}`}
                        onClick={() => handleVote('DOWN')}
                    />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        {isPinned && (
                            <FaThumbtack size={14} className="text-yellow-600" title="Pinned" />
                        )}
                        <Link 
                            href={`/c/${thread.chain?.slug || 'unknown'}/thread/${thread.id}`}
                            className="text-lg font-semibold link"
                        >
                            {thread.title}
                        </Link>
                    </div>
                    
                    <div className="info mb-2">
                        by <Link href={`/u/${thread.author.username}`} className="link">
                            <UsernameDisplay 
                                username={thread.author.username}
                                level={thread.author.level}
                                isVerified={thread.author.isVerified}
                                role={thread.author.role}
                                size="sm"
                            />
                        </Link> in <Link href={`/c/${thread.chain?.slug || 'unknown'}`} className="link">c/{thread.chain?.slug || 'unknown'}</Link> • {formatISO(thread.createdAt.toISOString())} (IST) • {thread._count.replies} replies
                    </div>
                    
                    <div className="text-sm text-gray-600 line-clamp-2">
                        {thread.content}
                    </div>
                    
                    {thread.threadTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {thread.threadTags.map((threadTag) => (
                                <span
                                    key={threadTag.tag.id}
                                    className="px-2 py-1 text-xs"
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
    );
}
