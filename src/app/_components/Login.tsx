"use client";

import Image from "next/image";
import { CircleChevronRightIcon } from "lucide-react";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/webauthn";

export default function Login() {
    return (
        <section className="flex h-full w-full items-center justify-center bg-gray-50">
            <div className="login-container flex flex-col items-center rounded-custom-34 border border-white bg-white px-16 py-12 shadow-custom">
                <Image
                    src="/login-page-logo.svg"
                    alt="apple-logo"
                    width={160}
                    height={160}
                />

                <h1 className="mb-6 mt-5 text-center text-4xl font-semibold">
                    Sign in
                </h1>
                <InputField />
                <Seperator />
                <PasskeyLogin />
            </div>
        </section>
    );
}

function InputField() {
    const { data } = useSession();
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputValue(e.target.value);
    };

    const handleButtonClick = async (
        e: MouseEvent<HTMLButtonElement>,
    ): Promise<void> => {
        e.preventDefault();
        try {
            const res = await signIn("passkey", { email: inputValue, redirect: false });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        console.log(data);
    };

    return (
        <div className="mx-auto max-w-md p-4">
            <form className="relative">
                <input
                    type="email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    className="w-full rounded-custom border border-gray-400 px-4 py-4 pr-12 text-gray-700 placeholder-custom-gray focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    onClick={handleButtonClick}
                >
                    <CircleChevronRightIcon className="size-6" />
                </button>
            </form>
        </div>
    );
}

function PasskeyLogin() {
    const handleButtonClick = async (
        e: MouseEvent<HTMLButtonElement>,
    ): Promise<void> => {
        e.preventDefault();
        try {
            const res = await signIn("passkey", { redirect: false });
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md p-4">
            <button
                className="w-full rounded-custom border border-gray-400 px-4 py-4 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={handleButtonClick}
            >
                Sign in with passkey
            </button>
        </div>
    );
}

function Seperator() {
    return (
        <div className="relative flex w-100 items-center py-5">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
    );
}
