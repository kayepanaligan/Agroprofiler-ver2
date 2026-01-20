import { Link } from "@inertiajs/react";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string;
    className?: string;
};

export default function Card({ title, children, className = "" }: Props) {
    return (
        <div
            className={
                "w-full sm:max-w-10xl px-4 py-4 border bg-white dark:bg-[#161616] shadow-sm dark:border-green-600 border-1 overflow-hidden sm:rounded-[1rem] " +
                className
            }
        >
            <div className="text-sm text-slate-500 mb-3 ">{title}</div>
            {children}
        </div>
    );
}
