import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage(){
    return(
        <>
            <div className="py-2 px-4 rounded-md border border-[#404040] max-w-[420px] m-auto">
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
