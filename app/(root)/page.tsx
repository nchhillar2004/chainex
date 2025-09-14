import MainWelcomeCard from "@/components/MainWelcomeCard";

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
