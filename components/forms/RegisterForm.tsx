'use client'
import { register } from "@/actions/register";
import { useActionState } from "react";

export default function RegisterForm(){
    const [state, action, pending] = useActionState(register, undefined);

    return(
        <form action={action} className="my-4 space-y-1">
            <div>
                <label htmlFor="username">Username<span className="text-red-500">*</span>:</label>
                <input className="outline-none border border-zinc-600 py-1 px-2" placeholder="your_username" type="text" id="username" name="username" minLength={3} maxLength={20} required />
                {state?.errors?.username && <small className="error">{state.errors.username}</small>}
            </div>
            <div>
                <label htmlFor="email">Email Address (Optional):</label>
                <input className="outline-none border border-zinc-600 py-1 px-2" placeholder="email address" type="email" id="email" name="email" />
                {state?.errors?.email && <small className="error">{state.errors.email}</small>}
            </div>
            <div>
                <label htmlFor="password">Create a Password<span className="text-red-500">*</span>:</label>
                <input className="outline-none border border-zinc-600 py-1 px-2" placeholder="password" type="password" id="password" name="password" required />
                {state?.errors?.password ? 
                    <small className="error">{state.errors.password}</small>
                    : <small className="info">Create a strong password. Atleast 8 characters.</small>
                }
            </div>
            <div>
                <label htmlFor="cpassword">Confirm Password<span className="text-red-500">*</span>:</label>
                <input className="outline-none border border-zinc-600 py-1 px-2" placeholder="confirm password" type="password" id="cpassword" name="cpassword" required />
                {state?.errors?.cpassword && <small className="error">{state.errors.cpassword}</small>}
            </div>
            <label htmlFor="student_confirm" className="flex space-x-1 items-center my-2">
                <input type="checkbox" name="student_confirm" id="student_confirm" required/>
                <span>
                    I confirm that I am currently a student (school or college)<span className="text-red-500">*</span>.
                </span>
            </label>
            <button type="submit" disabled={pending} className="border border-zinc-600 bg-[#303030] py-1 w-full cursor-pointer hover:bg-[#282828]">Regsiter</button>
        </form>
    );
}

