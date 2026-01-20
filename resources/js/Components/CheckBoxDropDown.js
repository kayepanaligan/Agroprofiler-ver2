import { jsx as _jsx } from "react/jsx-runtime";
import Select from "react-select";
const customStyles = {
    control: (provided) => ({
        ...provided,
        display: "flex",
        borderColor: "#ccc",
        borderRadius: "0.8rem",
        padding: "2px",
        width: "200px",
        height: "43px",
        cursor: "ponter",
        flexWrap: "noWrap",
        border: "none",
        backgroundColor: "#f1f5f9",
        overflow: "auto",
        boxShadow: "1px",
        "&:hover": {
            borderColor: "#aaa",
        },
    }),
    option: (provided, state) => ({
        ...provided,
        display: "flex",
        padding: "7px",
        borderRadius: "0.6rem",
        width: "180px",
        cursor: "pointer",
        backgroundColor: state.isSelected
            ? "#007BFF"
            : state.isFocused
                ? "#f0f0f0"
                : "white",
        color: state.isSelected ? "white" : "black",
        "&:active": {
            backgroundColor: state.isSelected ? "#0056b3" : "#e6e6e6",
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#22c55e",
        borderRadius: "0.7rem",
        display: "flex",
        overflowX: "auto",
        whiteSpace: "nowrap",
        color: "white",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
        display: "flex",
        borderRadius: "0.8rem",
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "white",
        display: "flex",
        "&:hover": {
            backgroundColor: "#0056b3",
            color: "white",
        },
    }),
};
const CheckBoxDropDown = ({ options, onChange, value, placeholder, isMulti, }) => {
    return (_jsx(Select, { options: options, onChange: onChange, value: value, placeholder: placeholder, isMulti: isMulti, styles: customStyles }));
};
export default CheckBoxDropDown;
