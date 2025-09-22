import { getCommits } from "@/utils/github";
import Link from "next/link";

export default async function UpdatesCard(){
    const commits = await getCommits();

    return(
        <div className="max-w-[380px]">
            <div className="py-2 px-4 border border-[#404040] rounded-t-md bg-[#151515] flex items-center justify-between space-x-4">
                <b className="text-[16px]">Latest changes</b>
            </div>
            <div className="py-2 px-4 border-b border-x border-[#404040] bg-[#202020] rounded-b-md link">
                <ul className="">
                    {commits && commits.map((commit: any) => (
                        <li className="flex space-x-4 h-fit" key={commit.html_url}>
                            <div className="w-[8px] h-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#343434]"></div>
                                <div className="w-[2px] m-auto -mt-[1px] min-h-[24px] h-full bg-[#343434]"></div>
                            </div>
                            <Link href={commit.html_url} target="_blank">{commit.commit?.message}</Link>
                        </li>))}
                </ul>
                <small><Link href={"/updates"}>View changelog</Link></small>
            </div>
        </div>
    );
}
