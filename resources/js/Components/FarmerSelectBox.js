import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
const FarmerSelectBox = ({ onSelect }) => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    useEffect(() => {
        const fetchFarmers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/farmers");
                setFarmers(response.data);
            }
            catch (error) {
                console.error("Error fetching farmers:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchFarmers();
    }, []);
    return (_jsx(Autocomplete, { options: farmers, getOptionLabel: (option) => option.name, value: selectedFarmer, onChange: (_, newValue) => {
            setSelectedFarmer(newValue);
            onSelect(newValue);
        }, loading: loading, renderInput: (params) => (_jsx(TextField, { ...params, label: "Select Farmer", variant: "outlined", InputProps: {
                ...params.InputProps,
                endAdornment: (_jsxs(_Fragment, { children: [loading ? (_jsx(CircularProgress, { color: "inherit", size: 20 })) : null, params.InputProps.endAdornment] })),
            } })) }));
};
export default FarmerSelectBox;
