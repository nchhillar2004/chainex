import SidebarLayout from "@/components/SidebarLayout";
import Marquee from "@/components/ui/Marquee";
import { Config } from "@/config/config";
import Link from "next/link";

export default function ExploreChains(){
    return(
        <>
            <SidebarLayout>
                <div className="card max-md:hidden">
                    <Marquee messages={[
                        {text: `Welcome to ${Config.name}`, emoji: ""},
                        {text: `${Config.description}`, emoji: ""},
                        {text: "This is beta version", emoji: ""},
                        {text: "Advertise your chain here", emoji: "📺"}
                    ]} />
                </div>
                <div className="flex items-center justify-between space-x-2 link">
                    <h2 className="text-xl font-semibold">Explore Chains</h2>
                    <Link href={"/c/create"}>Create a chain</Link>
                </div>
            </SidebarLayout>

        </>
    );
}

