"use client"
import { useEffect } from "react";
import { login } from "@/actions/login";
import { useAuth } from "@/context/AuthContext";
import { useActionState } from "react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm(){
    const [ state, action, pending ] = useActionState(login, undefined);
    const { setUser } = useAuth();

    useEffect(() => {
        if (state?.user) {
            setUser(state.user);
            toast.success(<p>Logged in successfully</p>);
            redirect("/");
        }
    }, [state, setUser]);

    return(
        <form action={action} className="my-3 flex flex-col space-y-1">
            <label htmlFor="username">Username:</label>
            <input className="outline-none border border-zinc-599 py-1 px-2 mb-3" placeholder="your_username" type="text" id="username" name="username" required />
            <label htmlFor="password">Password:</label>
            <input className="outline-none border border-zinc-599 py-1 px-2 mb-3" placeholder="password" type="password" id="password" name="password" required />
            {state?.error && <div><small className="error">{state.error}</small></div>}
            <button type="submit" disabled={pending} className="border border-zinc-599 bg-[#303030] py-1 cursor-pointer hover:bg-[#282828]">Login</button>
        </form>

    );
}
