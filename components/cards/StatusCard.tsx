export default function StatusCard() {
    return(
        <div>
            <div className="py-2 px-4 border border-[var(--border)] rounded-t-md bg-[var(--card-header)]">
                <b className="text-[16px]">Live stats</b>
            </div>
            <div className="py-2 px-4 border-b border-x border-[var(--border)] bg-[var(--card-bg)] rounded-b-md">
                <ul className="space-y-2 link">
                    <li className="flex space-x-1 items-center"><p>Total users:</p><span>8998</span></li>
                    <li className="flex space-x-1 items-center"><p>Users online:</p><span>487</span></li>
                    <li className="flex space-x-1 items-center"><p>Total communities:</p><span>78</span></li>
                    <li className="flex space-x-1 items-center"><p>Server ping:</p><span>112<sub>ms</sub></span></li>
                </ul>
            </div>
        </div>

    );
}
