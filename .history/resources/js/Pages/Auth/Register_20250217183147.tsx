import { ChangeEvent, FormEventHandler, useRef, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { toast, ToastContainer } from "react-toastify";

interface RegisterFormData {
    pfp: File | null;
    firstname: string;
    lastname: string;
    email: string;
    section: string;
    sex: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } =
        useForm<RegisterFormData>({
            pfp: null,
            firstname: "",
            lastname: "",
            email: "",
            section: "",
            sex: "",
            password: "",
            password_confirmation: "",
        });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePreviewClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setData("pfp", file);

            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        } else {
            setData("pfp", null);
            setPreview(null);
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (data.pfp) formData.append("pfp", data.pfp);
        formData.append("firstname", data.firstname);
        formData.append("lastname", data.lastname);
        formData.append("email", data.email);
        formData.append("section", data.section);
        formData.append("sex", data.sex);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        post(route("register"), {
            data: formData,
            onFinish: () => reset("email", "password", "password_confirmation"),
            onError: (errors) => {
                console.error("Registration errors:", errors);
                const errorMessages = Array.isArray(errors)
                    ? errors
                    : Object.values(errors).flat();

                if (errorMessages.length > 0) {
                    toast.error(errorMessages.join(", "));
                } else {
                    toast.error(
                        "Registration failed. Please check your details and try again."
                    );
                }
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <ToastContainer />

            <form onSubmit={submit}>
                <div className="p-4 h-[500px] overflow-auto">
                    <br />
                    <h1 className="text-center text-bolder text-[25px] font-semibold text-green-600">
                        Create an account
                    </h1>
                    <br />
                    <div className="mt-4 ">
                        <div className="flex gap-5">
                            <div>
                                <InputLabel
                                    htmlFor="pfp"
                                    value="Profile Picture"
                                    className="text-white"
                                />

                                <input
                                    type="file"
                                    id="pfp"
                                    name="pfp"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <div
                                    className="w-24 h-24 rounded-lg overflow-hidden border-2 cursor-pointer"
                                    onClick={handlePreviewClick}
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile Preview"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <DefaultAvatar
                                            width="100%"
                                            height="100%"
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                    <InputError
                                        message={errors.pfp}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 ">
                            <div className="mt-3 flex gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="firstname"
                                        value="First name"
                                        className="text-white"
                                    />
                                    <TextInput
                                        id="firstname"
                                        name="firstname"
                                        value={data.firstname}
                                        className="mt-1 block w-full"
                                        autoComplete="firstname"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("firstname", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.firstname}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="lastname"
                                        value="Last name"
                                        className="text-white"
                                    />
                                    <TextInput
                                        id="lastname"
                                        name="lastname"
                                        value={data.lastname}
                                        className="mt-1 block w-full"
                                        autoComplete="lastname"
                                        onChange={(e) =>
                                            setData("lastname", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.lastname}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email"
                                    className="text-white"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="section"
                                    value="section"
                                    className="text-white"
                                />
                                <TextInput
                                    id="section"
                                    name="section"
                                    value={data.section}
                                    className="mt-1 block w-full"
                                    autoComplete="section"
                                    onChange={(e) =>
                                        setData("section", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.section}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="mt-4">
                            <InputLabel htmlFor="sex" value="Sex" />
                            <select
                                id="sex"
                                name="sex"
                                value={data.sex}
                                className="mt-1 block w-full border-slate-300 rounded-xl "
                                onChange={(e) => setData("sex", e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Sex
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <InputError message={errors.sex} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href={route("login")}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4" disabled={processing}>
                            {processing ? "Processing..." : "Register"}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
