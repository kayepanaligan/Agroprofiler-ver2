import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";

interface Farmer {
    id: number;
    name: string;
}

const FarmerSelectBox: React.FC<{
    onSelect: (farmer: Farmer | null) => void;
}> = ({ onSelect }) => {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

    useEffect(() => {
        const fetchFarmers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/farmers"); // Adjust endpoint based on your API
                setFarmers(response.data);
            } catch (error) {
                console.error("Error fetching farmers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFarmers();
    }, []);

    return (
        <Autocomplete
            options={farmers}
            getOptionLabel={(option) => option.name}
            value={selectedFarmer}
            onChange={(_, newValue) => {
                setSelectedFarmer(newValue);
                onSelect(newValue);
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Farmer"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default FarmerSelectBox;
