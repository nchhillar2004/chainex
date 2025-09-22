import PopularCommunitesCard from "@/components/cards/PopularCommunitiesCard";
import StatusCard from "@/components/cards/StatusCard";
import UpdatesCard from "@/components/cards/UpdatesCard";
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
            {user && 
                <div>
                    <CreateThreadForm/>
                </div>}
            <div className="flex max-md:flex-col justify-between min-md:space-x-4 max-md:space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Popular Threads</h2>
                </div>
                <div className="space-y-4">
                    <PopularCommunitesCard/>
                    <StatusCard/>
                    <div className="max-md:hidden">
                        <UpdatesCard/>
                    </div>
                </div>
            </div>
        </>
    );
}
