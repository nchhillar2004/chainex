export default function LoginForm(){
    return(
        <form className="my-4 flex flex-col space-y-1">
            <label htmlFor="username">Username:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="your_username" type="text" id="username" name="username" minLength={3} maxLength={20} required />
            <label htmlFor="password">Password:</label>
            <input className="outline-none border border-zinc-600 py-1 px-2 mb-3" placeholder="password" type="password" id="password" name="password" required />
            <button type="submit" className="border border-zinc-600 bg-[#303030] py-1 cursor-pointer hover:bg-[#282828]">Login</button>
        </form>

    );
}
