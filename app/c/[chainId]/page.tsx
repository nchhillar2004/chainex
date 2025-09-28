import { notFound } from "next/navigation";
import { getChainBySlug } from "@/lib/getChains";
import { getChainThreads } from "@/lib/getThreads";
import SidebarLayout from "@/components/SidebarLayout";
import Link from "next/link";
import { formatISO } from "@/utils/time";
import { getCurrentUser } from "@/hooks/getUser";
import ThreadCard from "@/components/cards/ThreadCard";
import CommunityModeration from "@/components/CommunityModeration";
import CommunityJoin from "@/components/CommunityJoin";

export default async function ChainIdPage(props: { params: Promise<{ chainId: string }> }) {
    const { chainId } = await props.params;
    const user = await getCurrentUser();
    const chain = await getChainBySlug(chainId, user?.id);

    if (!chain) {
        notFound();
    }

    const canCreateThread = user && (user.isVerified || user.role === "ADMIN");
    const threads = await getChainThreads(chain.id, 20, 0);
    const isOwner = user && user.id === chain.creator.id;
    const isAdmin = user && user.role === "ADMIN";

    return (
        <SidebarLayout>
            <div className="link">
                <div className="card">
                    <h1 className="text-2xl font-bold">{"c/"}{chain.slug}{": "}{chain.name}</h1>
                    <p>Created by: <Link href={`/u/${chain.creator.username}`}>{chain.creator.username}</Link></p>
                    {chain.description && <p className="my-1">Description: {chain.description}</p>}
                    {chain.chainTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                            <span>Tags:</span>
                            {chain.chainTags.map((chainTag) => (
                                <span
                                    key={chainTag.tag.id}
                                    className="px-2 py-1"
                                    style={{ backgroundColor: 'var(--button)', color: 'var(--link)' }}
                                >
                                    {"#"}{chainTag.tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="info">
                        {chain._count.members} members • {chain._count.threads} threads • {chain._count.boosts} boosts
                    </div>
                    <small className="info">Created: {formatISO(new Date(chain.createdAt).toISOString())} (IST)</small>
                    
                    {canCreateThread && (
                        <div className="mt-4">
                            <Link 
                                href={`/c/${chain.slug}/thread/new`}
                                className="link"
                            >
                                Create Thread
                            </Link>
                        </div>
                    )}
                </div>

                {/* Join Community */}
                <div className="mt-6">
                    <CommunityJoin
                        chainId={chain.id}
                        chainName={chain.name}
                        isMember={chain.isMember}
                        isCreator={chain.isCreator}
                        currentUser={user}
                    />
                </div>

                {/* Moderation Panel */}
                {(isOwner || isAdmin) && (
                    <div className="mt-6">
                        <CommunityModeration
                            chainId={chain.id}
                            isOwner={isOwner}
                            isAdmin={isAdmin}
                            threads={threads.map((thread: any) => ({
                                id: thread.id,
                                title: thread.title,
                                author: thread.author,
                                createdAt: thread.createdAt
                            }))}
                            members={[]} // TODO: Get community members
                        />
                    </div>
                )}

                {/* Threads List */}
                <div className="mt-6">
                    <h2>Threads</h2>
                    {threads.length === 0 ? (
                        <div className="card text-center py-8">
                            <p>No threads yet in this chain.</p>
                            {canCreateThread && (
                                <p>Be the first to create a thread!</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {threads.map((thread) => (
                                <ThreadCard key={thread.id} thread={thread} currentUser={user} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

