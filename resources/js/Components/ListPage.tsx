import Authenticated from "@/Layouts/AuthenticatedLayout";
import Auth from "@/Pages/Auth";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React, { ReactNode } from "react";

interface ListProps {
    list: React.ReactNode;
    header: React.ReactNode;
}

export default function ListPage({ list, header }: ListProps) {
    return (
        <div className="p-4 border shadow-sm rounded-[0.9rem]">
            <div>{header}</div>
            <div>{list}</div>
        </div>
    );
}
