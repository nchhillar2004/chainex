"use client"
import Link from "next/link";
import { FaCaretUp } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa6";
import { boostChain } from "@/actions/boostChain";
import { useState, useTransition } from "react";

interface ChainCardProps {
    chain: {
        id: number;
        name: string;
        slug: string | null;
        description: string | null;
        creator: {
            id: number;
            username: string;
            avatarUrl: string | null;
        };
        chainTags: {
            tag: {
                id: number;
                name: string;
            };
        }[];
        _count: {
            members: number;
            threads: number;
            boosts: number;
        };
        userBoosted?: boolean;
    };
}

export default function ChainCard({ chain }: ChainCardProps) {
    const [boostCount, setBoostCount] = useState(chain._count.boosts);
    const [userBoosted, setUserBoosted] = useState(chain.userBoosted || false);
    const [isPending, startTransition] = useTransition();

    const handleBoost = () => {
        startTransition(async () => {
            const result = await boostChain(chain.id);
            if (result?.success) {
                if (result.boosted) {
                    setBoostCount((prev: number) => prev + 1);
                    setUserBoosted(true);
                } else {
                    setBoostCount((prev: number) => prev - 1);
                    setUserBoosted(false);
                }
            }
        });
    };


    return (
        <div className="flex items-center space-x-4 justify-between link">
            <div className="flex space-x-4 items-center h-full w-[70%]">
                <div className="flex flex-col items-center space-y-1">
                    <FaCaretUp 
                        size={24} 
                        title="boost" 
                        className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userBoosted ? 'text-[var(--link)]' : ''}`}
                        onClick={handleBoost}
                    />
                    <div className="flex space-x-1 items-center text-xl leading-tight select-none">{boostCount}</div>
                    <FaCaretDown 
                        size={24} 
                        title="unboost" 
                        className={`cursor-pointer hover:bg-[var(--card-bg)] rounded-full p-1 ${userBoosted ? 'text-[var(--link)]' : ''}`}
                        onClick={handleBoost}
                    />
                </div>
                <div className="flex flex-col items-start justify-between h-full py-1 space-y-1">
                    <Link href={`/c/${chain.slug}`} className="text-2xl">{"c/"}{chain.slug}{": "}{chain.name}</Link>
                    <div className="info line-clamp-2 overflow-eclipse">
                        {chain.description || "No description provided"}
                    </div>
                </div>
            </div>
            <div className="flex space-x-4 items-center">
                <div className="info">
                    {chain._count.members} members • {chain._count.threads} threads
                </div>
            </div>
        </div>
    );
}
