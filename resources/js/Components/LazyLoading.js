import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LazyComponent = () => {
    return (_jsxs("div", { children: [_jsx("h2", { children: "This is a Lazy Loaded Component!" }), _jsx("p", { children: "Lazy loading helps improve performance by loading components only when they are needed." })] }));
};
export default LazyComponent;
