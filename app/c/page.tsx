import SidebarLayout from "@/components/SidebarLayout";
import Marquee from "@/components/ui/Marquee";
import { Config } from "@/config/config";

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
                <div>
                    <h2 className="text-xl font-semibold">Explore Chains</h2>
                </div>
            </SidebarLayout>

        </>
    );
}

