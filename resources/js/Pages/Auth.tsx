import Guest from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { ReactNode } from "react";
import Login from "./Auth/Login";

type props = {
    children: ReactNode;
};

export default function Auth({ children }: props) {
    return (
        <>
            <Head title="Authenticate" />

            <Guest>
                <div className="flex gap-5">
                    <div className="login">login</div>
                    <div className="register">register</div>
                </div>
            </Guest>
        </>
    );
}
