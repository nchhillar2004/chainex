"use client";
import Link from "next/link";
import { Config } from "@/config/config";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function Header(){
    const isAuthenticated: boolean = false;

    const {theme, setTheme} = useTheme();

    const toggleTheme = () => {
        if (theme === "yellow") {
            setTheme("blue");
        }else {
            setTheme("yellow");
        }
    };

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    }

    return(
        <header className="py-2 px-4 max-sm:px-2">
            <nav className="flex items-center justify-between space-x-1 flex-wrap">
                <Link href={"/"} className="flex space-x-1 items-center">
                    <Image priority src="/logo.svg" alt={`${Config.name} logo`} height={26} width={26} className="max-sm:h-[20px] max-sm:w-[20px]" onClick={toggleTheme}/>
                    <h1 className="text-2xl font-semibold max-sm:text-xl">{Config.name}</h1>
                </Link>

                <nav className="flex items-center link">
                    {isAuthenticated ? 
                        <>
                            <Link href={"create/thread"}>[create]</Link>
                            <div className="divider"></div>
                            <Link href={"profile"}>[profile]</Link>
                            <div className="divider"></div>
                            <Link href={"/"} onClick={handleLogout}>[logout]</Link>
                        </>
                        :
                        <>
                            <Link href={"/auth/login"}>[login]</Link>
                            <div className="divider"></div>
                            <Link href={"/auth/register"}>[register]</Link>
                        </>
                    }
                </nav>
            </nav>
        </header>
    );
}

