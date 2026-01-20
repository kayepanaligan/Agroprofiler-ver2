import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { FormEventHandler, useState } from "react";
import { PageProps } from "@/types";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            pfp: user.pfp,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        });

    // State to hold the preview image URL
    const [preview, setPreview] = useState<string | null>(
        user.pfp ? `/storage/${user.pfp}` : null
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData("pfp", file);
            setPreview(URL.createObjectURL(file)); // Generate preview URL
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-green-600">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm dark:text-white text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Profile Picture Upload */}
                <div className="relative">
                    <TextInput
                        type="text"
                        name="pfp"
                        value={
                            data.pfp
                                ? data.pfp instanceof File
                                    ? data.pfp.name
                                    : data.pfp
                                : ""
                        }
                        readOnly
                        className="cursor-pointer text-gray-500 text-xs relative pl-20 pr-4 py-2 border border-gray-300 rounded-md bg-white w-50 h-50"
                        style={{
                            backgroundImage: preview
                                ? `url(${preview})`
                                : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex gap-2">
                    <div>
                        <InputLabel htmlFor="firstname" value="First Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.firstname}
                            onChange={(e) =>
                                setData("firstname", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="name"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.firstname}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="lastname" value="Last Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.lastname}
                            onChange={(e) =>
                                setData("lastname", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="lastname"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.lastname}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
