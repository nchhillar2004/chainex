export default function RegisterForm(){
    return(
        <form className="my-4 flex flex-col space-y-1">
            <label htmlFor="username">Username<span className="text-red-500">*</span>:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="your_username" type="text" id="username" name="username" minLength={3} maxLength={20} required />
            <label htmlFor="email">Email Address (Optional):</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="email address" type="email" id="email" name="email" />
            <label htmlFor="password">Create a Password<span className="text-red-500">*</span>:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2" placeholder="password" type="password" id="password" name="password" required />
            <small className="mb-3">Create a strong password. Atleast 8 characters.</small>
            <label htmlFor="cpassword">Confirm Password<span className="text-red-500">*</span>:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="confirm password" type="password" id="cpassword" name="cpassword" required />
            <label htmlFor="student_confirm" className="flex space-x-1 items-center my-2">
                <input type="checkbox" name="student_confirm" id="student_confirm" required/>
                <span>
                    I confirm that I am currently a student (school or college)<span className="text-red-500">*</span>.
                </span>
            </label>
            <button type="submit" className="border border-zinc-600 bg-[#303030] py-1 cursor-pointer hover:bg-[#282828]">Regsiter</button>
        </form>
    );
}

