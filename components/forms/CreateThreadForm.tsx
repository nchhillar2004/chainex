"use client"
import { useTransition } from "react";
import { createThread } from "@/actions/createThread";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CreateThreadFormProps {
    chainId: number;
    chainName: string;
    postPolicy: string;
}

export default function CreateThreadForm({ chainId, chainName, postPolicy }: CreateThreadFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await createThread(formData);
            if (result?.success) {
                toast.success("Thread created successfully!");
                router.push(`/c/${chainName}/thread/${result.threadId}`);
            } else if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="card">
            <h1>Create Thread in {chainName}</h1>
            <p className="info mb-4">Posting Policy: {postPolicy}</p>
            
            <form action={handleSubmit}>
                <input type="hidden" name="chainId" value={chainId} />
                
                <div>
                    <label htmlFor="title">Thread Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        placeholder="Enter thread title"
                        maxLength={200}
                    />
                </div>

                <div>
                    <label htmlFor="content">Content *</label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        placeholder="Write your thread content..."
                        rows={8}
                    />
                </div>

                <div>
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        placeholder="e.g., discussion, question, help"
                    />
                    <small className="info">Add up to 5 tags to help categorize your thread</small>
                </div>

                <div className="flex gap-4">
                    <button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Thread"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}