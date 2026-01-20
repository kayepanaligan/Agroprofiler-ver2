import { useState, ChangeEvent } from "react";

const ImageInputPreview = () => {
    const [image, setImage] = useState<string | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative w-48 h-48 border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer">
            <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
            />
            {image ? (
                <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-gray-400">Choose an image</span>
            )}
        </div>
    );
};

export default ImageInputPreview;
