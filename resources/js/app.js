import { jsx as _jsx } from "react/jsx-runtime";
import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
const appName = import.meta.env.VITE_APP_NAME || "Agroprofiler";
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob("./Pages/**/*.tsx")),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(_jsx(App, { ...props }));
    },
    progress: {
        color: "#F5A603",
    },
});
