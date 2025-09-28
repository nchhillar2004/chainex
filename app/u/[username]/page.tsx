import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/getUser";
import SidebarLayout from "@/components/SidebarLayout";
import UserProfile from "@/components/UserProfile";
import { getCurrentUser } from "@/hooks/getUser";
import type { Metadata } from 'next';

interface UserPageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
    const { username } = await params;
    const user = await getUserByUsername(username);
    
    if (!user) {
        return {
            title: 'User Not Found',
        };
    }

    return {
        title: `${user.username} | ChainEX`,
        description: `View ${user.username}'s profile on ChainEX`,
    };
}

export default async function UserPage({ params }: UserPageProps) {
    const { username } = await params;
    const user = await getUserByUsername(username);
    const currentUser = await getCurrentUser();

    if (!user) {
        notFound();
    }

    return (
        <SidebarLayout>
            <div className="link">
                <UserProfile user={user} currentUser={currentUser} />
            </div>
        </SidebarLayout>
    );
}