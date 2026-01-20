import { useState, PropsWithChildren, ReactNode } from "react";
import { User } from "@/types";
import Sidebar from "@/Components/Sidebar";
import { ThemeProvider, useTheme } from "@/ThemeContext";
import { Moon, Sun } from "lucide-react";

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
    const [search, setSearch] = useState("");

    const { theme, toggleTheme } = useTheme();
    const [expanded, setExpanded] = useState<boolean>(true);
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
                        className={`pb-5 rounded-[1rem] row-span-3 bg-white dark:bg-[#0d1a25] shadow-sm transition-all duration-300 ${
                            expanded
                                ? "ml-[280px] w-[calc(100%-230px)]"
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
                            <div className="mt-6 ml-4 h-[590px] overflow-auto max-w-10xl mx-auto sm:px-6 lg:px-5">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
