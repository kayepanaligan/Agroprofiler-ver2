import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function FarmerSearch({ farmers, onFarmerSelect, }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFarmers, setFilteredFarmers] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchTerm(input);
        const filtered = farmers.filter((farmer) => farmer.firstname.toLowerCase().includes(input.toLowerCase()) ||
            farmer.lastname.toLowerCase().includes(input.toLowerCase()));
        setFilteredFarmers(filtered);
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search Farmer", value: searchTerm, onChange: handleSearch, className: "border border-gray-300 p-2 rounded-md w-full" }), searchTerm && (_jsx("div", { className: "absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg", children: filteredFarmers.length > 0 ? (filteredFarmers.map((farmer) => (_jsxs("div", { className: "p-2 hover:bg-gray-100 cursor-pointer", onClick: () => {
                        setSearchTerm(`${farmer.firstname} ${farmer.lastname}`);
                        onFarmerSelect(farmer);
                        setFilteredFarmers([]);
                    }, children: [farmer.firstname, " ", farmer.lastname] }, farmer.id)))) : (_jsx("div", { className: "p-2 text-gray-500", children: "No farmer as such existed" })) }))] }));
}
