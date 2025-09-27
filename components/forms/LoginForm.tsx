"use client"
import { useEffect } from "react";
import { login } from "@/actions/login";
import { useAuth } from "@/context/AuthContext";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm(){
    const [ state, action, pending ] = useActionState(login, undefined);
    const { setUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (state?.user) {
            setUser(state.user);
            toast.success(<p>Logged in successfully</p>);
            router.push("/");
        }
    }, [state, setUser]);

    return(
        <form action={action} className="my-3 space-y-1">
            <div>
                <label htmlFor="username">Username:</label>
                <input placeholder="your_username" type="text" id="username" name="username" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input placeholder="password" type="password" id="password" name="password" required />
            </div>
            {state?.error && <div><small className="error">{state.error}</small></div>}
            <button type="submit" disabled={pending}>Login</button>
        </form>

    );
}
