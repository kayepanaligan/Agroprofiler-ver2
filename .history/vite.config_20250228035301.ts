import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
        checker({ typescript: true, enableBuild: false }),
    ],
    esbuild: {
        loader: "tsx",
        logLevel: "silent", // Hide TypeScript errors
    },
    build: {
        outDir: "public/build",
        manifest: true,
    },
});
