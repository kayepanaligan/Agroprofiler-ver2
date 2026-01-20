import { useState, ChangeEvent } from "react";

interface Farmer {
    id: number;
    firstname: string;
    lastname: string;
}

interface FarmerSearchProps {
    farmers: Farmer[];
    onFarmerSelect: (farmer: Farmer) => void;
}

export default function FarmerSearch({
    farmers,
    onFarmerSelect,
}: FarmerSearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setSearchTerm(input);

        const filtered = farmers.filter(
            (farmer) =>
                farmer.firstname.toLowerCase().includes(input.toLowerCase()) ||
                farmer.lastname.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredFarmers(filtered);
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search Farmer"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            {searchTerm && (
                <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
                    {filteredFarmers.length > 0 ? (
                        filteredFarmers.map((farmer) => (
                            <div
                                key={farmer.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSearchTerm(
                                        `${farmer.firstname} ${farmer.lastname}`
                                    );
                                    onFarmerSelect(farmer);
                                    setFilteredFarmers([]);
                                }}
                            >
                                {farmer.firstname} {farmer.lastname}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">
                            No farmer as such existed
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
