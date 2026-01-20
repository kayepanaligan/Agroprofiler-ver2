import { useState, FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
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

    const [preview, setPreview] = useState<string | null>(user.pfp || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("pfp", file);
            setPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
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
                {/* Profile Picture Input */}
                <div className="flex flex-col items-start">
                    <InputLabel htmlFor="pfp" value="Profile Picture" />
                    <TextInput
                        type="file"
                        name="pfp"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="mt-2 w-24 h-24 rounded-full object-cover border"
                        />
                    )}
                    <InputError className="mt-2" message={errors.pfp} />
                </div>

                {/* First Name & Last Name */}
                <div className="flex gap-2">
                    <div>
                        <InputLabel htmlFor="firstname" value="First Name" />
                        <TextInput
                            id="firstname"
                            className="mt-1 block w-full"
                            value={data.firstname}
                            onChange={(e) =>
                                setData("firstname", e.target.value)
                            }
                            required
                            autoComplete="given-name"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.firstname}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="lastname" value="Last Name" />
                        <TextInput
                            id="lastname"
                            className="mt-1 block w-full"
                            value={data.lastname}
                            onChange={(e) =>
                                setData("lastname", e.target.value)
                            }
                            required
                            autoComplete="family-name"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.lastname}
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Email Verification Notice */}
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

                {/* Save Button */}
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
