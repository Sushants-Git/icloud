"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLoadingStore } from "~/stores/useLoadingStore";
import { motion, AnimatePresence } from "framer-motion";
import UserIconNav from "./Images/user-icon-nav.svg";
import SettingUserIcon from "./Images/setting-user.svg";
import SettingsIcon from "./Images/settings.svg";
import CloseIcon from "./Images/close.svg";
import LinkArrowIcon from "./Images/link-arrow.svg";

export default function UserComponent() {
    return <UserPopup />;
}

function UserPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const { setLoading } = useLoadingStore();

    const handleSignOut = () => {
        setLoading(true);
        signOut({ callbackUrl: "/" })
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                console.error("Sign out failed", error);
                setLoading(false);
            });
    };

    return (
        <div className="relative">
            <UserIconNav
                style={{ fill: !isOpen ? "white" : "#32323233" }}
                onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-0 mt-2 w-60 rounded-custom bg-white shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                        style={{
                            transformOrigin: "top right",
                        }}
                    >
                        <div className="rounded-t-custom border-b border-custom bg-appleGray py-4">
                            <div className="-mb-1 ml-4">
                                <h3 className="font-semibold text-black">Sushant Mishra</h3>
                                <p className="text-sm text-gray-500">sushantsgml@gmail.com</p>
                            </div>
                        </div>

                        <div className="px-1 pt-2">
                            <div className="-mb-2 flex w-full items-center rounded-customHalf hover:bg-appleGray">
                                <SettingsIcon
                                    className="h-8 w-10"
                                    style={{ fill: "#0071e3" }}
                                />
                                <p className="text-sm text-black">iCloud Settings</p>
                            </div>

                            <div className="mb-1 mt-3 flex w-full items-center rounded-customHalf hover:bg-appleGray">
                                <SettingUserIcon
                                    className="h-8 w-10"
                                    style={{ fill: "#0071e3" }}
                                />
                                <p className="text-sm text-appleBlue">Manage Apple ID</p>
                                <LinkArrowIcon
                                    className="-ml-1 h-7 w-8"
                                    style={{ fill: "#0071e3" }}
                                />
                            </div>
                        </div>

                        <div className="border-t border-custom mb-1 ml-2 mr-2">
                        </div>

                        <div
                            className="px-1"
                            onClick={handleSignOut}
                        >
                            <div className="flex w-full items-center rounded-customHalf hover:bg-appleGray mb-1">
                                <CloseIcon
                                    className="h-8 w-10"
                                    style={{ fill: "#e30000" }}
                                />
                                <p className="text-sm text-appleRed">Sign Out</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
