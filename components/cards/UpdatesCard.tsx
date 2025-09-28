import { getCommits } from "@/utils/github";
import { formatISO } from "@/utils/time";
import Link from "next/link";

interface GitHubCommit {
    commit: {
        message: string;
        author: { date: string }
    },
    html_url: string;
}

export default async function UpdatesCard(){
    const commits = await getCommits();

    return(
        <div>
            <div className="py-2 px-4 border border-[var(--border)] rounded-t-md bg-[var(--card-header)] flex items-center justify-between space-x-4">
                <b className="text-[16px]">Latest changes</b>
            </div>
            <div className="py-2 px-4 border-b border-x border-[var(--border)] bg-[var(--card-bg)] rounded-b-md link">
                <ul>
                    {commits && commits.map((commitData: GitHubCommit) => (
                        <li className="flex space-x-4" key={commitData.html_url}>
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-[var(--border)]"></div>
                                <div className="w-px flex-1 bg-[var(--border)]"></div>
                            </div>
                            <div className="flex flex-col justify-start pb-2">
                                <small className="leading-tight">{formatISO(commitData.commit.author.date)}</small>
                                <Link href={commitData.html_url} target="_blank" className="line-clamp-2 overflow-ellipsis">{commitData.commit?.message}</Link>
                            </div>
                        </li>))}
                </ul>
                <small><Link href={"/updates"}>View changelog</Link></small>
            </div>
        </div>
    );
}
