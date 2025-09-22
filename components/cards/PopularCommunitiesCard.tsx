import Link from "next/link";

export default function PopularCommunitesCard() {
    return(
    <div>
            <div className="py-2 px-4 border border-[#404040] rounded-t-md bg-[#151515] flex items-center justify-between space-x-4">
                <b className="text-[16px]">Popular communities</b>
                <select defaultValue={"members"}>
                    <option defaultChecked value={"members"}>members</option>
                    <option value={"threads"}>threads</option>
                </select>
            </div>
            <div className="py-2 px-4 border-b border-x border-[#404040] bg-[#202020] rounded-b-md">
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
