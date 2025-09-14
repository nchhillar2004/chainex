import Link from "next/link";
import { Config } from "@/config/config";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage(){
    return(
        <>
            <p>Required fields are marked with (<span className="text-red-500">*</span>)</p>
            <div className="py-2 px-4 rounded-md border border-[#404040] max-w-[450px] m-auto">
                <b className="text-xl">Registeration Form</b>
                <p>Fill this form to register on {Config.name}.</p>
                <RegisterForm/>
                <div className="">
                    <p>Note: New accounts are <b>limited</b> untill manually verified by our team ;)</p>
                    <p className="link">Already registered? <Link href={"/auth/login"}>Login instead.</Link></p>
                </div>
            </div>
        </>
    );
}

