"use client";
import Link from "next/link";
import { Config } from "@/config/config";
import Image from "next/image";
import { logout } from "@/actions/logout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export default function Header(){
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        toast.success(<p>User logged out</p>);
        redirect("/auth/login");
    }

    return(
        <header className="py-2 px-4 max-sm:px-2">
            <nav className="flex items-center justify-between space-x-1 flex-wrap">
                <div>
                    <Link href={"/"} className="flex space-x-1 items-center">
                        <Image src="/logo.svg" alt={`${Config.name} logo`} height={26} width={26} className="max-sm:h-[20px] max-sm:w-auto"/>
                        <h1 className="text-2xl font-semibold max-sm:text-xl">{Config.name}</h1>
                    </Link>
                </div>

                <nav className="flex items-center link">
                    <Link href={"/appearance"}>[appearance]</Link>
                    <div className="divider"></div>
                    {user ? 
                        <>
                            <Link href={"/u/profile"}>[{user?.username}]</Link>
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

