import React, { useState } from "react";
import NavLink from "./NavLink";
import {
    Bell,
    BookHeart,
    BookImage,
    BookUser,
    Brain,
    BugIcon,
    Building,
    ChevronDown,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    CircleUser,
    ClipboardList,
    Cog,
    CogIcon,
    ContactRound,
    Earth,
    Flower,
    Folder,
    HandCoins,
    Handshake,
    KeyRound,
    LayoutDashboard,
    Leaf,
    LogOut,
    NotebookTextIcon,
    Power,
    Tally5Icon,
    Tornado,
    Tractor,
    TreePalm,
    Trees,
    User2,
    User2Icon,
    Weight,
    Wheat,
    WheatIcon,
    Wrench,
} from "lucide-react";
import { User } from "@/types";
import Dropdown from "./Dropdown";
import { Link } from "@inertiajs/react";
import logo from "../Assets/logo.png";

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

    const handleFarmerToggle = () => {
        setIsFarmerOpen((prev) => !prev);
    };

    return (
        <div
            className={`fixed index-20 w-[17%] mt-5 p-5 overflow-x-auto bg-[#0D1A25] rounded-[1rem] ml-3 shadow {expanded ? "w-[10rem]" : "w-[20rem]}`}
        >
            <div className="w-full flex justify-center p-4">
                <img src={logo} alt="logo" width="200px" />
            </div>

            <div className="overflow-auto h-[420px] ">
                <ul>
                    <span className="ml-2 mb-4 text-sm text-slate-400">
                        Main
                    </span>
                    <li className="text-m mb-5">
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            <div className="flex gap-2">
                                <LayoutDashboard size={20} />
                                {expanded && <span>Dashboard</span>}
                            </div>
                        </NavLink>
                    </li>

                    <span className="ml-2 mb-4 text-sm text-slate-400">
                        List
                    </span>

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() => setIsUserOpen((prevState) => !prevState)}
                    >
                        <div className="flex gap-2 justify-between font-medium leading-5">
                            <div className="flex gap-2">
                                <User2 size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        User
                                    </span>
                                )}
                            </div>

                            <div className="flex-end">
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
                                    <div className="flex gap-2">
                                        <CircleUser size={20} />
                                        {expanded && <span>List</span>}
                                    </div>
                                </NavLink>
                            </li>

                            {/* <li className="border-l-2">
                                <NavLink
                                    href={route("farmers.index")}
                                    active={route().current("farmers.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2">
                                        <ContactRound size={20} />
                                        {expanded && <span>Roles</span>}
                                    </div>
                                </NavLink>
                            </li>
                            <li className="border-l-2">
                                <NavLink
                                    href={route("farmers.index")}
                                    active={route().current("farmers.index")}
                                    className="border-l-[1px] "
                                >
                                    <div className="flex gap-2">
                                        <KeyRound size={20} />
                                        {expanded && <span>Permissions</span>}
                                    </div>
                                </NavLink>
                            </li> */}
                        </ul>
                    )}

                    <li
                        className="text-sm cursor-pointer font-medium leading-5 p-2"
                        onClick={() =>
                            setIsFarmerOpen((prevState) => !prevState)
                        }
                    >
                        <div className="flex gap-2 justify-between font-medium leading-5">
                            <div className="flex gap-2">
                                <Wheat size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        Farmer
                                    </span>
                                )}
                            </div>

                            <div className="flex-end">
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
                            <li className="border-l-2">
                                <NavLink
                                    href={route("farm.index")}
                                    active={route().current("farm.index")}
                                >
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
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
                            <div className="flex gap-2">
                                <Leaf size={20} />
                                {expanded && (
                                    <span className="font-medium leading-5">
                                        Commodity
                                    </span>
                                )}
                            </div>

                            <div className="flex-end">
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
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
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
                            <div className="flex gap-2">
                                <Handshake size={20} />
                                {expanded && <span>Allocation</span>}
                            </div>

                            <div className="flex-end">
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
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
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
                            <div className="flex gap-2">
                                <BugIcon size={20} />
                                {expanded && <span>Damages</span>}
                            </div>

                            <div className="flex-end">
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
                                    <div className="flex gap-2">
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
                                    <div className="flex gap-2">
                                        <NotebookTextIcon size={19} />
                                        {expanded && <span>Records</span>}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    )}

                    <br />
                    <span className="ml-2 mb-4 text-sm text-slate-400">
                        Reports
                    </span>
                    <li
                        className="text-m"
                        onMouseEnter={() => setIsRecommendationOpen(true)}
                        onMouseLeave={() => setIsRecommendationOpen(false)}
                        onClick={handleRecommendationToggle}
                    >
                        <NavLink
                            href={route("recommendations.index")}
                            active={route().current("recommendations.index")}
                        >
                            <div className="flex gap-2">
                                <Brain size={20} />
                                {expanded && <span>Recommendation</span>}
                            </div>
                        </NavLink>
                    </li>

                    <br />
                </ul>
            </div>

            <div className="border-t">
                <span className="inline-flex rounded-md">
                    <Link
                        href={route("profile.edit")}
                        className="inline-flex items-center py-4 px-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                    >
                        <img
                            src="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/10-1024.png"
                            width="35px"
                            height="35px"
                            className="mr-1 rounded-lg"
                        />
                        <div className="text-xs text-left mx-2">
                            <div className="flex ">
                                <span className="capitalize text-[12px] font-semibold text-black">
                                    {user.firstname}
                                </span>

                                <span className="capitalize text-[12px] font-semibold text-black">
                                    {user.lastname}
                                </span>
                            </div>
                            <div>
                                <span className="capitalize text-[11px]">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <svg
                            className="ms-2 -me-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                </span>

                <div className="flex gap-2 justify-center content-center">
                    <Link href={route("logout")} method="post" as="button">
                        <span className="inline-flex mt-3 gap-1 text-[10px] font-semibold text-red-600 border p-2 rounded-lg shadow-lg  hover:bg-red-200 hover:text-red-400">
                            <Power size={15} />
                            Log Out
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
