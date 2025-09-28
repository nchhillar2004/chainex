"use client"
import { useEffect } from "react";
import { createChain } from "@/actions/createChain";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateChainForm() {
    const [state, action, pending] = useActionState(createChain, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success("Chain created successfully!");
            router.push("/c");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <div className="card">
            <h1>Create a New Chain</h1>
            <form action={action}>
                <div>
                    <label htmlFor="name">Chain Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Enter chain name"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        placeholder="Describe your chain (optional)"
                    />
                </div>

                <div>
                    <label htmlFor="visibility">Visibility *</label>
                    <select
                        id="visibility"
                        name="visibility"
                        required
                    >
                        <option value="PUBLIC">Public - Anyone can discover and join</option>
                        <option value="PRIVATE">Private - Only invited members can join</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="postPolicy">Posting Policy *</label>
                    <select
                        id="postPolicy"
                        name="postPolicy"
                        required
                    >
                        <option value="VERIFIED_ONLY">Verified users only</option>
                        <option value="MODERATORS_ONLY">Moderators only</option>
                        <option value="LEVEL_BASED">Level-based posting</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="minAge">Minimum Age</label>
                    <input
                        type="number"
                        id="minAge"
                        name="minAge"
                        min="13"
                        max="100"
                        placeholder="e.g., 18"
                    />
                </div>

                <div>
                    <label htmlFor="maxAge">Maximum Age</label>
                    <input
                        type="number"
                        id="maxAge"
                        name="maxAge"
                        min="13"
                        max="100"
                        placeholder="e.g., 25"
                    />
                </div>

                <div>
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        placeholder="e.g., technology, programming, students"
                    />
                    <small>Add up to 5 tags to help people discover your chain</small>
                </div>

                {state?.error && (
                    <div className="error">
                        {state.error}
                    </div>
                )}

                <div>
                    <button type="submit" disabled={pending}>
                        {pending ? "Creating..." : "Create Chain"}
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