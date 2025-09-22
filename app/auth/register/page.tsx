import type { Metadata } from 'next';
import Link from "next/link";
import { Config } from "@/config/config";
import RegisterForm from "@/components/forms/RegisterForm";
import prisma from '@/lib/db';

export const metadata: Metadata = {
    title: `Register | ${Config.name}`
};

export default async function RegisterPage(){
    const count = await prisma.user.count();
    return(
        <>
            {count >= Config.USER_CAP - 1000 ? 
                <div>
                    <p>⚠️  We are not accepting new registrations for now. User limit will be updated shortly. Stay tuned!</p>
                </div>
                :
                <div>
                    <p>⏳ Hurry! Limited registrations available for now. Sign up before it’s full!</p>
                    <p>Required fields are marked with (<span className="text-red-500">*</span>)</p>
                    <div className="py-2 px-4 rounded-md border border-[var(--border)] max-w-[450px] m-auto">
                        <b className="text-xl">Registeration Form</b>
                        <p>Fill this form to register on {Config.name}.</p>
                        <RegisterForm/>
                        <div className="">
                            <p>Note: New accounts are <b>limited</b> untill manually verified by our team ;)</p>
                            <p className="link">Already registered? <Link href={"/auth/login"}>Login instead.</Link></p>
                        </div>
                    </div>
                </div>}
        </>
    );
}

