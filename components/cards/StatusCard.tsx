import { getTotalChains, getTotalThreads, getTotalUser } from "@/hooks/getStats";
import pingServer from "@/utils/pingServer";

export default async function StatusCard() {
    const userCount = await getTotalUser();
    const chainCount = await getTotalChains();
    const threadCount = await getTotalThreads();
    const ping = await pingServer();

    return(
        <div>
            <div className="py-2 px-4 border border-[var(--border)] rounded-t-md bg-[var(--card-header)]">
                <b className="text-[16px]">Live stats</b>
            </div>
            <div className="py-2 px-4 border-b border-x border-[var(--border)] bg-[var(--card-bg)] rounded-b-md">
                <ul className="space-y-2 link">
                    <li className="flex space-x-1 items-center"><p>Total users:</p><span>{userCount}</span></li>
                    <li className="flex space-x-1 items-center"><p>Total chains:</p><span>{chainCount}</span></li>
                    <li className="flex space-x-1 items-center"><p>Total threads:</p><span>{threadCount}</span></li>
                    <li className="flex space-x-1 items-center"><p>Server ping:</p><span>{ping}ms</span></li>
                </ul>
            </div>
        </div>

    );
}
