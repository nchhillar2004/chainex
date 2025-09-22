import PopularChainsCard from "./cards/PopularChainsCard";
import StatusCard from "./cards/StatusCard";
import UpdatesCard from "./cards/UpdatesCard";
import SearchForm from "./forms/SearchForm";

export default function Sidebar() {
    return(
        <>
            <aside className="space-y-4">
                <SearchForm/>
                <PopularChainsCard/>
                <StatusCard/>
                <div className="max-md:hidden">
                    <UpdatesCard/>
                </div>

            </aside>
        </>
    );
}
