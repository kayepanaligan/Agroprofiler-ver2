import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef, } from "react";
export default forwardRef(function TextInput({ type = "text", className = "", isFocused = false, ...props }, ref) {
    const localRef = useRef(null);
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);
    return (_jsx("input", { ...props, type: type, className: "border-gray-300 dark:bg-transparent dark:text-white focus:border-green-500 focus:ring-green-500 rounded-[0.8rem] shadow-sm " +
            className, ref: localRef }));
});
