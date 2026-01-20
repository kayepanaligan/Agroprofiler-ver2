import { useState, PropsWithChildren, ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { User } from "@/types";
import Sidebar from "@/Components/Sidebar";
import { User2 } from "lucide";
import { LogOut, Search, User2Icon } from "lucide-react";
import TextInput from "@/Components/TextInput";
import NavBar from "@/Components/NavBar";

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

    return (
        <div className="min-h-screen  bg-gray-100">
            {/* <NavBar user={user} /> */}
            <div className="flex ">
                {}
                <Sidebar user={user} />

                <main className="absolute pb-5 mt-5 w-[81%] rounded-[1rem] right-5 row-span-3 bg-white shadow-sm">
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
    );
}
