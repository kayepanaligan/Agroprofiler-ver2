import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
export default function Search({ onSearch }) {
    const [query, setQuery] = useState("");
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };
    return (_jsx("div", { children: _jsx("input", { type: "search", name: "search", value: query, id: "search", onChange: handleInputChange, placeholder: "search...", className: "rounded-xl bg-slate-100 shadow-sm border-none focus:ring-1 focus:ring-green-700" }) }));
}
