import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ImageInputPreview = () => {
    const [image, setImage] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: "relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer", children: [_jsx("input", { type: "file", accept: "image/*", className: "absolute inset-0 opacity-0 cursor-pointer", onChange: handleImageChange }), image ? (_jsx("img", { src: image, alt: "Preview", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-gray-400", children: "Choose an image" }))] }));
};
export default ImageInputPreview;
