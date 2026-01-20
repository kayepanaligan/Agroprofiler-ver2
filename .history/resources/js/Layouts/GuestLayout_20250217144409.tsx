import Card from "@/Components/Card";

import { PropsWithChildren } from "react";
import loginBg from "../Assets/login_bg.jpg";
import logo from "../Assets/logo.png";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-green-400">
            <div className="grid grid-flow-col grid-cols-2 bg-yellow-200">
                <div className="bg-white w-full">{children}</div>
                <div className="bg-green-900 w-full">
                    <div className="object-cover">
                        <div className="flex justify-center content-center w-full">
                            <img
                                src={logo}
                                alt="log in bg"
                                width="250px"
                                height="100%"
                                className="rounded-2xl"
                            />
                        </div>
                        <img
                            src={loginBg}
                            alt="log in bg"
                            width="100%"
                            height="100%"
                            className="rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
