import React from "react";
import "./ui.css";
import Link from "next/link";

type Msg = {
    text: string;
    emoji?: string;
    url?: string;
}

export default function Marquee({ messages }: { messages: Msg[] }) {
    return (
        <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-marquee text-xl text-[var(--text-color)] font-semibold">
                {messages.map((msg: Msg) => (
                    <Link href={msg.url ? msg.url : "#"} key={msg.text}>
                        {msg.emoji ? msg.emoji : "🚀"}{msg.text}{" "}
                    </Link>
                ))}
            </div>
        </div>
    );
}

