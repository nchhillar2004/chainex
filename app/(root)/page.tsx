import MainWelcomeCard from "@/components/cards/MainWelcomeCard";
import SidebarLayout from "@/components/SidebarLayout";
import Marquee from "@/components/ui/Marquee";
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
                <div>
                    <h2 className="text-xl font-semibold">Popular Threads</h2>
                </div>
            </SidebarLayout>
        </>
    );
}
