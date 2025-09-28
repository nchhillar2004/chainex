"use client"
import { useEffect, useState } from "react";
import { submitVerification } from "@/actions/submitVerification";
import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { validateReferralCode } from "@/actions/referralActions";

export default function VerificationForm(){
    const [state, action, pending] = useActionState(submitVerification, undefined);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [referralCode, setReferralCode] = useState("");
    const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);
    const [referralCodeCreator, setReferralCodeCreator] = useState("");

    useEffect(() => {
        // Check for referral code in URL
        const refParam = searchParams.get('ref');
        if (refParam) {
            setReferralCode(refParam);
            validateReferralCode(refParam).then((result) => {
                if (result.valid && result.referralCode) {
                    setReferralCodeValid(true);
                    setReferralCodeCreator(result.referralCode.creator);
                } else {
                    setReferralCodeValid(false);
                }
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (state?.success) {
            toast.success("Verification request submitted successfully!");
            router.push("/");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return(
        <form action={action} className="my-4 space-y-1">
            <div>
                <label htmlFor="name">Full name<span className="text-red-500">*</span>:</label>
                <input placeholder="Full name" autoComplete="name" type="text" id="name" name="name" minLength={4} maxLength={40} required />
            </div>
            <div>
                <label htmlFor="school">School name (including city & country)<span className="text-red-500">*</span>:</label>
                <input placeholder="School name" type="text" id="school" name="school" minLength={10} required />
                <small className="info">Enter the full school name including the city and country. Ex: Massachusetts Institute of Technology (MIT), Cambridge, United States</small>
            </div>
            <div>
                <label htmlFor="email">School Email Address (Optional):</label>
                <input placeholder="school email" type="email" id="email" name="email" />
                <small className="info">.edu email gets you verified faster.</small>
            </div>
            <div>
                <label htmlFor="dob">Date of birth<span className="text-red-500">*</span>:</label>
                <input placeholder="dob" type="date" pattern="\d{2}-\d{2}-\d{4}" id="dob" name="dob" min={"1980-01-01"} required />
                <small className="info">Date of birth cannot be changed later!</small>
            </div>
            <div>
                <label htmlFor="document">Upload a valid document (school id card, fee receipt)<span className="text-red-500">*</span>:</label>
                <input type="file" id="document" name="document" accept=".jpg, .jpeg, .png, .pdf" required />
                <small className="info">Upload a valid document, issued by school/ institute (within 6 months from now) which:
                    <ul className="list-disc list-inside">
                        <li>Should include your full name</li>
                        <li>School/ institute name</li>
                        <li>Should be clear and readable</li>
                        <li>In .jpg, .jpeg, .png OR .pdf format only</li>
                    </ul>
                </small>
            </div>
            <div>
                <label htmlFor="ref">Referral Code (Optional):</label>
                <input 
                    placeholder="Enter referral code" 
                    type="text" 
                    id="ref" 
                    name="ref" 
                    value={referralCode}
                    onChange={(e) => {
                        setReferralCode(e.target.value);
                        if (e.target.value.length >= 4) {
                            validateReferralCode(e.target.value).then((result) => {
                                if (result.valid && result.referralCode) {
                                    setReferralCodeValid(true);
                                    setReferralCodeCreator(result.referralCode.creator);
                                } else {
                                    setReferralCodeValid(false);
                                    setReferralCodeCreator("");
                                }
                            });
                        } else {
                            setReferralCodeValid(null);
                            setReferralCodeCreator("");
                        }
                    }}
                />
                {referralCodeValid === true && (
                    <div className="text-green-600 text-sm mt-1">
                        ✓ Valid referral code from {referralCodeCreator} - Priority verification enabled!
                    </div>
                )}
                {referralCodeValid === false && (
                    <div className="text-red-600 text-sm mt-1">
                        ✗ Invalid or inactive referral code
                    </div>
                )}
                <small className="info">Enter a referral code for priority verification and get verified within 24 hours.</small>
            </div>
            <label htmlFor="student_confirm" className="flex space-x-1 items-center my-2">
                <input type="checkbox" name="student_confirm" id="student_confirm" required/>
                <span>
                    I confirm that I am currently a student<span className="text-red-500">*</span>.
                </span>
            </label>
            {state?.error && (
                <div className="error">
                    {state.error}
                </div>
            )}
            <button type="submit" disabled={pending}>
                {pending ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}

