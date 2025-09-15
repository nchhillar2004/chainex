import CreateThreadForm from "@/components/forms/CreateThreadForm";
import MainWelcomeCard from "@/components/MainWelcomeCard";
import { Config } from '@/config/config';
import { getCurrentUser } from "@/hooks/getUser";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Home | ${Config.name}`
};

export default async function Home(){
    const user = await getCurrentUser();
    return(
        <>
            {!user && <MainWelcomeCard/>}
            {user && <div>
                <CreateThreadForm/>
            </div>}
            <div>
                <h2 className="text-xl font-semibold">Popular Threads</h2>
            </div>
        </>
    );
}
