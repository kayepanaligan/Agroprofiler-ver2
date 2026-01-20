import { PropsWithChildren } from "react";
import loginBg from "../Assets/login_bg.jpg";
import logo from "../Assets/logo.png";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center sm:pt-0 ">
            <div className="grid grid-flow-col grid-cols-2 min-w-full min-h-screen p-2 bg-white">
                <div className="w-full p-2 flex justify-center items-center rounded-lg">
                    {children}
                </div>
                <div className="w-full bg-green-700 rounded-[15px]">
                    <div className="object-cover bg-cover bg-center h-64 w-full relative">
                        {/* <img
                            src={loginBg}
                            alt="log in bg"
                            width="100%"
                            height="100%"
                            className="absolute rounded-2xl"
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
