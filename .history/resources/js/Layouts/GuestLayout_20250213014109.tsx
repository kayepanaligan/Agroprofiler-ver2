import ApplicationLogo from "@/Components/ApplicationLogo";
import Card from "@/Components/Card";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import loginBg from "../Assets/login_bg.jpg";
import logo from "../Assets/logo.png";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-green-400">
            <div className="flex justify-center">
                <img
                    src={logo}
                    alt="log in bg"
                    width="100%"
                    height="100%"
                    className="rounded-2xl"
                />
            </div>

            <Card title="" className=" max-w-[50rem]">
                <div className="flex gap-5">
                    <div className="w-[1300px]">{children}</div>
                    <div className="w-[1000px] object-cover">
                        <img
                            src={loginBg}
                            alt="log in bg"
                            width="100%"
                            height="100%"
                            className="rounded-2xl"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
