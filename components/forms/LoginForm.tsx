"use client"
import { login } from "@/actions/login";
import { useActionState } from "react";

export default function LoginForm(){
    const [ state, action, pending ] = useActionState(login, undefined);

    return(
        <form action={action} className="my-4 flex flex-col space-y-1">
            <label htmlFor="username">Username:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="your_username" type="text" id="username" name="username" required />
            <label htmlFor="password">Password:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="password" type="password" id="password" name="password" required />
            {state?.error && <div><small className="error">{state.error}</small></div>}
            <button type="submit" disabled={pending} className="border border-zinc-600 bg-[#303030] py-1 cursor-pointer hover:bg-[#282828]">Login</button>
        </form>

    );
}
