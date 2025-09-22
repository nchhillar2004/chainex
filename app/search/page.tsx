import type { Metadata } from 'next';
import SidebarLayout from "@/components/SidebarLayout";
import { Config } from '@/config/config';
import Link from 'next/link';
import { Chain, Thread, User } from '@prisma/client';

interface SearchPageProps {
    searchParams: { query?: string };
}

export const metadata: Metadata = {
    title: "Search Results",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.query?.trim();

    const res = await fetch(`${Config.baseUrl}/api/search?query=${encodeURIComponent(query ?? '')}`, {cache: 'no-store'});
    const data = await res.json();
    console.log(data);

    return (
        <div className='link'>
            <SidebarLayout>
                <p>Showing results for '{query}'...</p>
                <ul><p>Users:</p>
                    {data.users.length>0 ? data.users.map((data: User) => (
                        <li key={data.id}>
                            <Link href={`/u/${data.username}`}>
                                {data.username}
                            </Link>
                        </li>
                    )) : <small>No users found from this username.</small>}
                </ul>
                <ul><p>Chains:</p>
                    {data.chains.length>0 ? data.chains.map((data: Chain) => (
                        <li key={data.id}>
                            <Link href={`/c/${data.id}`}>
                                {data.name}
                            </Link>
                        </li>
                    )) : <small>No related chains found.</small>}
                </ul>
                <ul><p>Threads:</p>
                    {data.threads.length>0 ? data.threads.map((data: Thread) => (
                        <li key={data.id}>
                            <Link href={`/t/${data.id}`}>
                                {data.title}
                            </Link>
                        </li>
                    )) : <small>No related threads found.</small>}
                </ul>
            </SidebarLayout>
        </div>
    );
}
