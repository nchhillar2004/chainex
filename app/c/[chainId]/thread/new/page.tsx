import { notFound } from "next/navigation";
import { getChainBySlug } from "@/lib/getChains";
import SidebarLayout from "@/components/SidebarLayout";
import CreateThreadForm from "@/components/forms/CreateThreadForm";
import { getCurrentUser } from "@/hooks/getUser";
import { redirect } from "next/navigation";

interface CreateThreadPageProps {
    params: Promise<{ chainId: string }>;
}

export default async function CreateThreadPage({ params }: CreateThreadPageProps) {
    const { chainId } = await params;
    const chain = await getChainBySlug(chainId);
    const user = await getCurrentUser();

    if (!chain) {
        notFound();
    }

    if (!user) {
        redirect("/auth/login");
    }

    if (!user.isVerified && user.role !== "ADMIN") {
        return (
            <SidebarLayout>
                <div className="link">
                    <div className="card">
                        <h1>Verification Required</h1>
                        <p>You need to be verified to create threads in this chain.</p>
                        <p>Please complete your verification process first.</p>
                        <a href="/auth/verify" className="link">Go to Verification</a>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="link">
                <CreateThreadForm 
                    chainId={chain.id} 
                    chainName={chain.name}
                    postPolicy={chain.postPolicy}
                />
            </div>
        </SidebarLayout>
    );
}