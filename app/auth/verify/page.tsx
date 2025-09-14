import { Config } from "@/config/config";
import VerificationForm from "@/components/forms/VerificationForm";
import Link from "next/link";

export default function VerificationPage(){
    return(
        <>
            <p>Required fields are marked with (<span className="text-red-500">*</span>)</p>
            <p>Follow all the instruction to get maximum chances of getting verified.</p>
            <div className="py-2 px-4 rounded-md border border-[#404040] max-w-[450px] m-auto">
                <b className="text-xl">Verification Form</b>
                <p>Get verified and access all features of {Config.name};)</p>
                <VerificationForm />
                <div className="">
                    <ul className="list-disc list-inside">Note: 
                        <li>
                            Verification may take upto <b>48 hours</b>.
                        </li>
                        <li className="link">This data will only be used to verify your account and will not be stored. read more at <Link href={"/privacy"}>[privacy policy]</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
}


