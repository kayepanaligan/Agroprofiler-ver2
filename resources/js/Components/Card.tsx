import { Link } from "@inertiajs/react";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title: string | ReactNode;
    className?: string;
    id?: string;
};

export default function Card({ title, children, className = "", id }: Props) {
    return (
        <div
            id={id}
            className={
                "w-full sm:max-w-10xl px-4 py-4 border-[2px] bg-white dark:bg-[#161616] dark:border-green-600 border-1 overflow-hidden sm:rounded-[1rem] " +
                className
            }
        >
            <div className="text-sm text-slate-500 mb-3 ">{title}</div>
            {children}
        </div>
    );
}
