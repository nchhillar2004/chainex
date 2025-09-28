import CreateChainForm from "@/components/forms/CreateChainForm";
import SidebarLayout from "@/components/SidebarLayout";

export default function CreateChain(){
    return(
        <SidebarLayout>
            <div className="link">
                <CreateChainForm/>
            </div>
        </SidebarLayout>
    );
}

