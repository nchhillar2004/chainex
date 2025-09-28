import SidebarLayout from "@/components/SidebarLayout";
import Marquee from "@/components/ui/Marquee";
import { Config } from "@/config/config";
import Link from "next/link";
import { getTopChains } from "@/lib/getChains";
import ChainCard from "@/components/cards/ChainCard";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";

export default async function ExploreChains(){
    const sessionId = (await cookies()).get("sessionId")?.value;
    let userId: number | undefined;
    
    if (sessionId) {
        const session = await getSession(sessionId);
        userId = session?.userId;
    }
    
    const chains = await getTopChains(20, userId);

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
                <div className="flex items-center justify-between space-x-2 link mb-6">
                    <h2 className="text-xl font-semibold">Explore Chains</h2>
                    <Link 
                        href={"/c/create"}
                    >
                        Create a chain
                    </Link>
                </div>

                {chains.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chains yet</h3>
                        <p className="text-gray-500 mb-4">Be the first to create a chain and start building a community!</p>
                        <Link 
                            href="/c/create"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Create the first chain
                        </Link>
                    </div>
                ) : (
                    <div className="">
                        {chains.map((chain) => (
                            <ChainCard key={chain.id} chain={chain} />
                        ))}
                    </div>
                )}
            </SidebarLayout>
        </>
    );
}

