import Link from "next/link";
import { MdChecklist } from "react-icons/md";
import { MdOutlineLogin } from "react-icons/md";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaSchoolLock } from "react-icons/fa6";
import { FaCode } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import LoginForm from "@/components/forms/LoginForm";

export default function MainWelcomeCard() {
    return(
        <div className="py-4 px-8 max-sm:px-2 bg-[var(--card-bg)] min-sm:rounded-xl border border-[var(--border)]">
            <div className="text-center">
                <h1 className="font-bold min-lg:text-5xl max-sm:text-2xl min-sm:text-3xl my-2">{"> Connect. Share. Learn."}</h1>
                <p className="text-zinc-400 lg:text-xl min-md:max-w-[60%] m-auto py-2">The ultimate text-image board <b>only for students.</b> Ask question, share
                    resources/ solutions, create communities & explore in a completely secure, minimal and information-dense environment.
                </p>
            </div>
            <hr className="my-4 text-zinc-600"/>
            <div className="flex justify-around items-start flex-col min-md:flex-row max-md:space-y-4 ">
                <div>
                    <h2 className="font-semibold min-lg:text-3xl min-sm:text-xl max-sm:text-[16px] flex items-center space-x-2">
                        <MdChecklist className="text-[var(--text-color)]"/> <span>Core Features</span></h2>
                    <ul className="list-inside ml-2 lg:text-xl">
                        <li className="flex items-center space-x-1 my-2"><MdOutlineQuestionAnswer className="text-[var(--text-color)] mr-2" />Text/ Image Boards</li>
                        <li className="flex items-center space-x-1 my-2"><FaRegQuestionCircle className="text-[var(--text-color)] mr-2" />Question/ Answer Forums</li>
                        <li className="flex items-center space-x-1 my-2"><MdGroups className="text-[var(--text-color)] mr-2" />Community (Chains) groups</li>
                        <li className="flex items-center space-x-1 my-2"><FaShieldAlt className="text-[var(--text-color)] mr-2" />Ultra secure & private</li>
                        <li className="flex items-center space-x-1 my-2"><FaSchoolLock className="text-[var(--text-color)] mr-2" />Only for school & Univ. students</li>
                        <li className="flex items-center space-x-1 my-2"><FaCode className="text-[var(--text-color)] mr-2" />Completely Open source & transparent</li>
                    </ul>
                </div>
                <div className="max-sm:w-[90%]">
                    <h2 className="font-semibold min-lg:text-3xl min-sm:text-xl flex items-center max-sm:text-[16px] space-x-2">
                        <MdOutlineLogin className="text-[var(--text-color)]"/>
                        <span>
                            Access Your Account
                        </span>
                    </h2>
                    <LoginForm/>
                    <p className="link">No account yet? <Link href={"auth/register"}>Create one now</Link></p>
                </div>
            </div>
        </div>
    );
}

