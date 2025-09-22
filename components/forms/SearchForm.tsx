'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { Chain, Thread, User } from "@prisma/client";

interface SearchResult {
    id: number;
    type: "thread" | "chain" | "user";
    name: string;
}

export default function SearchForm() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<SearchResult[]>([]);
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`/search?${params.toString()}`);
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length < 2) {
                setResults([]);
                setShowDropdown(false);
                return;
            }
            fetch(`/api/search?query=${encodeURIComponent(query.trim())}`)
                .then(async (res) => {
                    if(!res.ok){
                        const text = await res.text();
                        console.log(text)
                    }
                    return res.json();
                })
                .then((data) => {
                    const formattedResults: SearchResult[] = [
                        ...data.chains.map((c: Chain) => ({ id: c.id, type: "chain", name: c.name })),
                        ...data.threads.map((t: Thread) => ({ id: t.id, type: "thread", name: t.title })),
                        ...data.users.map((u: User) => ({ id: u.id, type: "user", name: u.username }))
                    ];
                    setResults(formattedResults);
                    setShowDropdown(true);
                });
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);
            handleSearch(query.trim());
        }
    }

    const handleSelect = (result: SearchResult) => {
        setShowDropdown(false);
        if (result.type==="user") replace(`/u/${result.name}`);
        if (result.type==="chain") replace(`/c/${result.id}`);
        if (result.type==="thread") replace(`/t/${result.id}`);
    }

    return(
        <div>
            <form className="flex items-center h-[32px] w-full" onSubmit={handleSubmit}>
                <input 
                    placeholder="Search Threads, Chains..." 
                    type="search" 
                    className="w-full h-full" 
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    aria-label="Search"
                    minLength={3}
                    required/>
                <button className="!w-fit h-full" type="submit" aria-label="Submit search"><BiSearch/></button>
            </form>
            {showDropdown && results.length>0 && (
                <div>
                    {results.map((result: SearchResult) => (
                        <div key={`${result.type}-${result.id}`}
                            className="cursor-pointer"
                            onClick={() => handleSelect(result)}>
                            {result.type}: {result.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
