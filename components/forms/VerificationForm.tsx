export default function VerificationForm(){
    return(
        <form className="my-4 space-y-1">
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
                <input type="file" id="document" accept=".jpg, .jpeg, .png, .pdf" required />
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
                <input placeholder="XXXX-XXXX-XXXX-XXXX" type="text" id="ref" name="ref" />
                <small className="info">Enter a referral/ invite code for priority verification and get verified within 24 hours.</small>
            </div>
            <label htmlFor="student_confirm" className="flex space-x-1 items-center my-2">
                <input type="checkbox" name="student_confirm" id="student_confirm" required/>
                <span>
                    I confirm that I am currently a student<span className="text-red-500">*</span>.
                </span>
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

