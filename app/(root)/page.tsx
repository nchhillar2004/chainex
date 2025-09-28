import MainWelcomeCard from "@/components/cards/MainWelcomeCard";
import SidebarLayout from "@/components/SidebarLayout";
import Marquee from "@/components/ui/Marquee";
import { Config } from '@/config/config';
import { getCurrentUser } from "@/hooks/getUser";
import { getTopThreads } from "@/lib/getThreads";
import ThreadCard from "@/components/cards/ThreadCard";
import ThreadFilters from "@/components/ThreadFilters";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Home | ${Config.name}`
};

export default async function Home({
    searchParams
}: {
    searchParams: Promise<{ filter?: string; page?: string }>
}) {
    const user = await getCurrentUser();
    const params = await searchParams;
    const filter = params.filter || 'top';
    const page = parseInt(params.page || '1');
    const offset = (page - 1) * 20;
    
    const threads = await getTopThreads(20, offset, filter);

    return(
        <>
            <SidebarLayout>
                <div className="card max-md:hidden">
                    <Marquee messages={[
                        {text: `Welcome to ${Config.name}`, emoji: ""},
                        {text: `${Config.description}`, emoji: ""},
                        {text: "This is beta version", emoji: ""},
                        {text: "Advertise your community here", emoji: "📺"}
                    ]} />
                </div>
                <div>
                    {!user && <MainWelcomeCard/>}
                </div>
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Popular Threads</h2>
                        <ThreadFilters currentFilter={filter} />
                    </div>
                    
                    {threads.length === 0 ? (
                        <div className="card text-center py-8">
                            <p>No threads found.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {threads.map((thread) => (
                                <ThreadCard key={thread.id} thread={thread} currentUser={user} />
                            ))}
                        </div>
                    )}
                </div>
            </SidebarLayout>
        </>
    );
}
