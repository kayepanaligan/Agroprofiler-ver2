import React, { useState } from "react";
import NavLink from "./NavLink";
import {
    Bell,
    BookHeart,
    BookImage,
    BookUser,
    Brain,
    BugIcon,
    ChevronDown,
    CircleUser,
    ClipboardList,
    HandCoins,
    Handshake,
    KeyRound,
    LayoutDashboard,
    Leaf,
    LogOut,
    Menu,
    Moon,
    NotebookTextIcon,
    Power,
    Sun,
    Tally5Icon,
    Tornado,
    Tractor,
    TreePalm,
    Trees,
    User2,
    User2Icon,
    UserX2Icon,
    Weight,
    Wheat,
    WheatIcon,
    Wrench,
} from "lucide-react";
import { User } from "@/types";
import Dropdown from "./Dropdown";
import { Link } from "@inertiajs/react";
import logo from "../Assets/logo_final.png";
import { useTheme } from "@/ThemeContext";

type Props = {
    user: {
        pfp: string;
        firstname: string;
        lastname: string;
        email: string;
        role: "admin" | "super admin";
    };
};

export default function Sidebar({ user }: Props) {
    const [expanded, setExpanded] = useState(true);
    const [isAllocationOpen, setIsAllocationOpen] = useState(false);
    const [isCommodityOpen, setIsCommodityOpen] = useState(false);
    const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
    const [isCropDamagesOpen, setIsCropDamagesOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isFarmerOpen, setIsFarmerOpen] = useState(false);

    const handleToggle = () => {
        setIsAllocationOpen((prev) => !prev);
    };

    const handleCommodityToggle = () => {
        setIsCommodityOpen((prev) => !prev);
    };

    const handleRecommendationToggle = () => {
        setIsCommodityOpen((prev) => !prev);
    };

    const handleCropDamagesToggle = () => {
        setIsCropDamagesOpen((prev) => !prev);
    };

    const handleUserToggle = () => {
        setIsUserOpen((prev) => !prev);
    };

    const toggleMenu = () => {
        setExpanded((prev) => !prev);
    };

    const handleFarmerToggle = () => {
        setIsFarmerOpen((prev) => !prev);
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <div
            className={`fixed index-20 p-5 overflow-x-auto bg-white dark:bg-[#0D1A25] rounded-[1rem] ml-3 shadow {expanded ? "w-[]" : "w-[]}`}
        >
            <div className="flex gap-2">
                <button onClick={toggleMenu} className="p-2">
                    <Menu className="w-6 h-6 dark:text-white" />
                </button>
                <div className="w-full flex justify-center p-4">
                    <img src={logo} alt="logo" width="150px" />
                </div>
            </div>

            <div className="flex items-center justify-center p-4">
                {expanded ? (
                    <div
                        className={`relative w-[90px] h-12 flex items-center rounded-full p-1 cursor-pointer transition ${
                            theme === "dark" ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                        onClick={toggleTheme}
                    >
                        <div
                            className={`w-10 h-10 bg-white rounded-full shadow-md transform transition ${
                                theme === "dark"
                                    ? "translate-x-10"
                                    : "translate-x-0"
                            }`}
                        />
                        <span className="absolute flex justify-center items-center left-3 text-xs text-black dark:text-white">
                            {theme === "dark" ? (
                                <>
                                    <Sun className="w-5 h-5 text-white" />
                                </>
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            )}
                        </span>
                        <span className="absolute right-4 text-xs text-black dark:text-white">
                            {theme === "dark" ? (
                                <>
                                    <Moon className="w-5 h-5 text-blue-950" />
                                </>
                            ) : (
                                <Moon className="w-5 h-5 text-blue-350" />
                            )}
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full dark:bg-yellow-400 transition"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-6 h-6" />
                        ) : (
                            <Moon className="w-6 h-6" />
                        )}
                    </button>
                )}
            </div>

            <div className="overflow-auto h-[420px] ">
                <ul>
                    <span className="ml-2 mb-4 text-sm font-semibold text-slate-500 dark:text-white">
                        Main
                    </span>
                    <li className="text-m mb-5 ">
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500 hover:text-green-500">
                                <LayoutDashboard size={20} />
                                {expanded && <span>Dashboard</span>}
                            </div>
                        </NavLink>
                    </li>

                    <span className="ml-2 mb-4 text-sm font-semibold text-slate-600 dark:text-white">
                        List
                    </span>

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() => setIsUserOpen((prevState) => !prevState)}
                    >
                        <div className="flex gap-2 justify-between font-medium leading-5">
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <User2 size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        User
                                    </span>
                                )}
                            </div>

                            <div className="flex-end dark:text-white">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </li>

                    {isUserOpen && (
                        <ul
                            className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden inline-block ${
                                isUserOpen
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <li className="border-l-2">
                                <NavLink
                                    href={route("users.index")}
                                    active={route().current("users.index")}
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <CircleUser size={20} />
                                        {expanded && <span>List</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() =>
                            setIsFarmerOpen((prevState) => !prevState)
                        }
                    >
                        <div className="flex gap-2 justify-between font-medium leading-5">
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <Wheat size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        Farmer
                                    </span>
                                )}
                            </div>

                            <div className="flex-end dark:text-white">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </li>

                    {isFarmerOpen && (
                        <ul
                            className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden inline-block ${
                                isFarmerOpen
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <li className="border-l-2 dark:text-white">
                                <NavLink
                                    href={route("farm.index")}
                                    active={route().current("farm.index")}
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <ClipboardList size={20} />
                                        {expanded && <span>Farms</span>}
                                    </div>
                                </NavLink>
                            </li>

                            <li className="border-l-2">
                                <NavLink
                                    href={route("farmers.index")}
                                    active={route().current("farmers.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <BookUser size={20} />
                                        {expanded && <span>List</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() =>
                            setIsCommodityOpen((prevState) => !prevState)
                        }
                    >
                        <div className="flex gap-2 justify-between font-medium leading-5">
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <Leaf size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        Commodity
                                    </span>
                                )}
                            </div>

                            <div className="flex-end dark:text-white">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </li>
                    {isCommodityOpen && (
                        <ul
                            className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden inline-block ${
                                isCommodityOpen
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <li className="border-l-2">
                                <NavLink
                                    href={route("commodity.index")}
                                    active={route().current("commodity.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <TreePalm size={20} />
                                        {expanded && <span>Category</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("commodity.list.index")}
                                    active={route().current(
                                        "commodity.list.index"
                                    )}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <NotebookTextIcon size={19} />
                                        {expanded && <span>List</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() =>
                            setIsAllocationOpen((prevState) => !prevState)
                        }
                    >
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <Handshake size={20} />
                                {expanded && <span>Allocation</span>}
                            </div>

                            <div className="flex-end dark:text-white">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </li>
                    {isAllocationOpen && (
                        <ul
                            className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                                isAllocationOpen
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <li className="border-l-2">
                                <NavLink
                                    href={route("allocation.type.index")}
                                    active={route().current(
                                        "allocation.type.index"
                                    )}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <HandCoins size={20} />
                                        {expanded && <span>Type</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("funding.index")}
                                    active={route().current("funding.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <BookHeart size={19} />
                                        {expanded && <span>Source</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("identifier.index")}
                                    active={route().current("identifier.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <Weight size={19} />
                                        {expanded && <span>Identifier</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("allocations.index")}
                                    active={route().current(
                                        "allocations.index"
                                    )}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <NotebookTextIcon size={19} />
                                        {expanded && <span>Records</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() =>
                            setIsCropDamagesOpen((prevState) => !prevState)
                        }
                    >
                        <div className="flex gap-2 justify-between">
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <BugIcon size={20} />
                                {expanded && <span>Damages</span>}
                            </div>

                            <div className="flex-end dark:text-white">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </li>

                    {isCropDamagesOpen && (
                        <ul
                            className={`relative left-[1rem] transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                                isCropDamagesOpen
                                    ? "max-h-40 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <li className="border-l-2">
                                <NavLink
                                    href={route("crop.damage.show")}
                                    active={route().current("crop.damage.show")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <Tornado size={20} />
                                        {expanded && <span>Type</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("crop.damages.index")}
                                    active={route().current(
                                        "crop.damages.index"
                                    )}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                        <NotebookTextIcon size={19} />
                                        {expanded && <span>Records</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    <br />
                    <span className="ml-2 mb-4 text-sm font-semibold text-slate-500 dark:text-white">
                        Reports
                    </span>
                    <li
                        className="text-m "
                        onMouseEnter={() => setIsRecommendationOpen(true)}
                        onMouseLeave={() => setIsRecommendationOpen(false)}
                        onClick={handleRecommendationToggle}
                    >
                        <NavLink
                            href={route("recommendations.index")}
                            active={route().current("recommendations.index")}
                        >
                            <div className="flex gap-2 dark:text-white dark:hover:text-green-500">
                                <Brain size={20} />
                                {expanded && (
                                    <span className="dark:text-white dark:hover:text-green-500">
                                        Recommendation
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </li>

                    <br />
                </ul>
            </div>

            <div className=" w-[230px] text-ellipsis">
                {expanded ? (
                    <span className="inline-flex">
                        <Link
                            href={route("profile.edit")}
                            className="inline-flex dark:border-green-600 border-[2px] items-center py-4 px-3 text-sm leading-4 font-medium rounded-[1rem] text-gray-500 bg-transparent hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                        >
                            <img
                                src="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/10-1024.png"
                                width="35px"
                                height="35px"
                                className="mr-1 rounded-lg"
                            />
                            <div className="text-left mx-2">
                                <div className="flex gap-2 ">
                                    <span className="capitalize text-[12px] font-semibold  text-black dark:text-green-600">
                                        {user.firstname}
                                    </span>

                                    <span className="capitalize dark:text-green-600 font-semibold text-[12px] text-black">
                                        {user.lastname}
                                    </span>
                                </div>
                                <div>
                                    <span className="capitalize dark:text-white font-regular text-[11px]">
                                        ({user.role})
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </span>
                ) : (
                    <span>
                        <Link
                            href={route("profile.edit")}
                            className="inline-flex dark:border-green-600 border-[2px] items-center py-2 px-2 text-sm leading-4 font-medium rounded-lg text-gray-500 bg-transparent hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                        >
                            <User2 size={20} />
                        </Link>
                    </span>
                )}

                {expanded ? (
                    <div className="flex gap-2 justify-center content-center">
                        <Link href={route("logout")} method="post" as="button">
                            <span className="inline-flex mt-3 gap-1 text-[10px] font-semibold hover:bg-red-700 hover:text-white text-red-600 border p-2 rounded-lg shadow-lg  ">
                                <Power size={13} />
                                LOG OUT
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex">
                        <Link href={route("logout")} method="post" as="button">
                            <span className="inline-flex mt-3 gap-1 text-[10px] font-semibold hover:bg-red-700 hover:text-white text-red-600 border p-2 rounded-lg shadow-lg  ">
                                <Power size={13} />
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
