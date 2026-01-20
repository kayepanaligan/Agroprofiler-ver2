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

    return (
        <ThemeProvider>
            <div className=" ">
                <div className="grid grid-flow-col grid-cols-4 mt-5">
                    <Sidebar user={user} />

                    <main className="col-span-3 absolute pb-5 mt-5 w-[80%] rounded-[1rem] right-5 row-span-3 bg-white dark:bg-[#0d1a25] shadow-sm">
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
