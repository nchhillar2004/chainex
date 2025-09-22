import Link from "next/link";

export default function PopularChainsCard() {
    return(
    <div>
            <div className="py-2 px-4 border border-[var(--border)] rounded-t-md bg-[var(--card-header)] flex items-center justify-between space-x-4">
                <b className="text-[16px]">Popular chains</b>
                <select defaultValue={"members"} disabled>
                    <option defaultChecked value={"members"}>members</option>
                    <option value={"threads"}>threads</option>
                </select>
            </div>
            <div className="py-2 px-4 border-b border-x border-[var(--border)] bg-[var(--card-bg)] rounded-b-md">
                <ul className="space-y-2 link">
                    <li className="flex space-x-2 items-center"><Link href={"#"}>c/General</Link><small>(12k)</small></li>
                    <li className="flex space-x-2 items-center"><Link href={"#"}>c/Politics</Link><small>(11.4k)</small></li>
                    <li className="flex space-x-2 items-center"><Link href={"#"}>c/Computer-Science</Link><small>(11k)</small></li>
                    <li className="flex space-x-2 items-center"><Link href={"#"}>c/Mathematics</Link><small>(10k)</small></li>
                    <li className="flex space-x-2 items-center"><Link href={"#"}>c/Music</Link><small>(9.2k)</small></li>
                </ul>
            </div>
        </div>
    );
}
