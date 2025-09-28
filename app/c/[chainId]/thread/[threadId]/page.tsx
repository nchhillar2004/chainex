import { notFound } from "next/navigation";
import { getThreadById } from "@/lib/getThreads";
import SidebarLayout from "@/components/SidebarLayout";
import ThreadDetail from "@/components/ThreadDetail";
import { getCurrentUser } from "@/hooks/getUser";

interface ThreadPageProps {
    params: Promise<{ chainId: string; threadId: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
    const { threadId } = await params;
    const thread = await getThreadById(parseInt(threadId));
    const user = await getCurrentUser();

    if (!thread) {
        notFound();
    }

    return (
        <SidebarLayout>
            <div className="link">
                <ThreadDetail thread={thread} currentUser={user} />
            </div>
        </SidebarLayout>
    );
}