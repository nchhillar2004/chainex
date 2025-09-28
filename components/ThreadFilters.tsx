"use client"
import { useRouter, useSearchParams } from "next/navigation";

interface ThreadFiltersProps {
    currentFilter: string;
}

export default function ThreadFilters({ currentFilter }: ThreadFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('filter', filter);
        params.delete('page'); // Reset to page 1 when changing filter
        router.push(`/?${params.toString()}`);
    };

    const filters = [
        { value: 'top', label: 'Top' },
        { value: 'popular', label: 'Popular' },
        { value: 'recent', label: 'Recent' }
    ];

    return (
        <div className="flex space-x-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-3 py-1 text-sm rounded ${
                        currentFilter === filter.value
                            ? 'bg-[var(--link)] text-white'
                            : 'bg-[var(--button)] hover:bg-[var(--card-bg)]'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
