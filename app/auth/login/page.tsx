import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { Config } from '@/config/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Login | ${Config.name}`
};

export default function LoginPage(){
    return(
        <>
            <div className="card max-w-[420px] m-auto">
                <b className="text-xl">Login Form</b>
                <p>Fill this form to access your account.</p>
                <LoginForm/>
                <div className="">
                    <p className="link">Not registered yet? <Link href={"/auth/register"}>Register now.</Link></p>
                </div>
            </div>
        </>
    );
}
