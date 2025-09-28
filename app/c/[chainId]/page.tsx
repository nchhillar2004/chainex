import { notFound } from "next/navigation";
import { getChainBySlug } from "@/lib/getChains";
import SidebarLayout from "@/components/SidebarLayout";
import Link from "next/link";
import { formatISO } from "@/utils/time";

export default async function ChainIdPage(props: { params: Promise<{ chainId: string }> }) {
    const { chainId } = await props.params;
    const chain = await getChainBySlug(chainId);

    if (!chain) {
        notFound();
    }

    return (
        <SidebarLayout>
            <div className="link">
                <div className="card">
                    <h1>{"c/"}{chain.slug}{": "}{chain.name}</h1>
                    <p>Created by: <Link href={`/u/${chain.creator.username}`}>{chain.creator.username}</Link></p>
                    {chain.description && <p className="my-1">Description: {chain.description}</p>}
                    {chain.chainTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                            <span>Tags:</span>
                            {chain.chainTags.map((chainTag: any) => (
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
                </div>
            </div>
        </SidebarLayout>
    );
}

