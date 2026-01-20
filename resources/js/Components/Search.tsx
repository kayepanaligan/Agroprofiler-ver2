import React, { useState } from "react";

interface SearchProps {
    onSearch: (query: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };
    return (
        <div>
            <input
                type="search"
                name="search"
                value={query}
                id="search"
                onChange={handleInputChange}
                placeholder="search..."
                className="rounded-xl bg-slate-100 shadow-sm border-none focus:ring-1 focus:ring-green-700"
            />
        </div>
    );
}
