import Link from "next/link";

export default function Footer(){
    return(
        <footer className="py-2">
            <div className="text-center text-zinc-400 text-[12px]">
                &copy; 2025. Student Platform. All rights reserved.
            </div>
            <div className="flex link justify-center items-center space-x-2 flex-wrap">
                <Link href={"about"}>[about]</Link>
                <Link href={"contact"}>[contact]</Link>
                <Link href={"terms"}>[terms]</Link>
                <Link href={"privacy"}>[privacy]</Link>
            </div>
        </footer>
    );
}
