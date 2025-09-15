import MainWelcomeCard from "@/components/MainWelcomeCard";
import { Config } from '@/config/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Home | ${Config.name}`
};

export default function Home(){
    const isAuthenticated: boolean = false;
    return(
        <>
            {!isAuthenticated && <MainWelcomeCard/>}
            <div>
                popular threads
            </div>
        </>
    );
}
