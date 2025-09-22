import { getCurrentUser } from "@/hooks/getUser"
import prisma from "@/lib/db";

export default async function CreateThreadForm() {
    const user = await getCurrentUser();

    const chains = await prisma.chain.findMany({
        where: {
            members: {
                some: { userId: user?.id },
            }
        }
    });
    return (
        <div className="py-4 px-8 max-sm:px-2 bg-[var(--card-bg)] min-sm:rounded-xl border border-[var(--border)]">
            <h1 className="font-bold text-2xl mb-4">Create Thread</h1>
            <form>
                <div className="flex max-md:flex-col max-md:space-y-2 min-md:space-x-2 min-md:justify-between">
                    <div className="min-md:w-[50%] w-full">
                        <label htmlFor="title">Thread title<span className="text-red-500">*</span>:</label><br/>
                        <input placeholder="Give a brief title" className="w-full" type="text" id="title" name="title" autoComplete="off" required/>
                    </div>
                    <div>
                        <label htmlFor="chain">Select a chain<span className="text-red-500">*</span>:</label><br/>
                        <select defaultChecked={false} id="chain" name="chain" required>
                            {chains.length>0 ?
                                chains.map((chain) => (
                                    <option key={chain.id} value={chain.id}>{chain.name}</option>
                                ))
                                : <option disabled defaultChecked>Join a chain to post something</option>
                            }
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="content">Content</label><br/>
                    <textarea placeholder="Thread content" id="content" name="content" className="w-full min-h-[100px] max-h-[250px]" maxLength={2000} required />
                </div>
                <div className="flex min-md:space-x-2 max-md:flex-col max-md:space-y-2">
                    <div>
                        <label htmlFor="file">Attach a file</label><br/>
                        <input type="file" placeholder="Select file" id="file" name="file" />
                    </div>
                    <div>
                        <label htmlFor="img">Upload an image</label><br/>
                        <input type="image" placeholder="Select image" id="img" name="img" />
                    </div>

                </div>
                <div>
                    <label htmlFor="tags">Add tags (Optional):</label>
                    <input placeholder="Tags" type="text" id="tags" name="tags"/>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}
