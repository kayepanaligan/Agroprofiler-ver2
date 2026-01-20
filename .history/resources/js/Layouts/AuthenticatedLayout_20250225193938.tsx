import { useState, PropsWithChildren, ReactNode } from "react";
import { User } from "@/types";
import Sidebar from "@/Components/Sidebar";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider } from "@/Context/ThemeContext";

export default function Authenticated({
    user,
    header,
    breadcrumbs,
    children,
}: PropsWithChildren<{
    user: User;
    header?: ReactNode;
    breadcrumbs?: ReactNode;
}>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [expanded, setExpanded] = useState(() =>
        JSON.parse(localStorage.getItem("sidebarExpanded") || "false")
    );
    return (
        <ThemeProvider>
            <div className=" ">
                <div className="grid grid-flow-col gap-4 mt-4 transition-all duration-300">
                    <Sidebar
                        user={user}
                        expanded={expanded}
                        setExpanded={setExpanded}
                    />

                    <main
                        className={`flex flex-col pb-5 rounded-[1rem] row-span-3 bg-white dark:bg-[#0d1a25] overflow-x-auto scrollbar-none shadow-sm transition-all-ease duration-7000 ${
                            expanded
                                ? "ml-[290px] w-[calc(100%-310px)]"
                                : "ml-[120px] w-[calc(100%-130px)]"
                        }`}
                    >
                        {header && (
                            <header>
                                <div className="relative top-[2rem] max-w-10xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                                    {header}
                                </div>
                            </header>
                        )}

                        <div className="relative">
                            <div>
                                <span className="text-xs text-slate-400 ml-8">
                                    {breadcrumbs}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 ml-4 h-[580px] py-4 w-[100%] mx-auto sm:px-6 lg:px-8 ">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
