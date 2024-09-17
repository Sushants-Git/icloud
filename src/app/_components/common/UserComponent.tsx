"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import UserIconNav from "/public/icons/user-icon-nav.svg";
import SettingUserIcon from "/public/icons/setting-user.svg";
import SettingsIcon from "/public/icons/settings.svg";
import CloseIcon from "/public/icons/close.svg";
import LinkArrowIcon from "/public/icons/link-arrow.svg";

import { useLoadingStore } from "~/stores/useLoadingStore";
import { Session } from "next-auth";

interface isHomeScreenProps {
  isforHomeScreen?: boolean;
}

export default function UserComponent({
  isforHomeScreen = false,
}: isHomeScreenProps) {
  return <UserPopup isforHomeScreen={isforHomeScreen} />;
}

const UserPopup: React.FC<isHomeScreenProps> = ({ isforHomeScreen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { setLoading } = useLoadingStore();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setLoading(false);
    }
  };

  const userIconNavStyle = isforHomeScreen
    ? { fill: !isOpen ? "white" : "#32323233" }
    : { fill: !isOpen ? "black" : "white" };

  return (
    <div className="relative">
      <UserIconNav
        style={userIconNavStyle}
        onClick={() => setIsOpen(!isOpen)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-60 rounded-custom bg-white shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformOrigin: "top right" }}
          >
            <UserInfo session={session} />
            <UserActions handleSignOut={handleSignOut} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserInfo: React.FC<{ session: Session | null }> = ({ session }) => (
  <div className="rounded-t-custom border-b border-custom bg-appleGray py-4">
    <div className="-mb-1 ml-4">
      <h3 className="font-semibold text-black">{session?.user.name}</h3>
      <p className="text-sm text-gray-500">{session?.user.email}</p>
    </div>
  </div>
);

const UserActions: React.FC<{ handleSignOut: () => void }> = ({
  handleSignOut,
}) => (
  <>
    <div className="px-1 pt-2">
      <ActionItem
        icon={<SettingsIcon className="h-8 w-10" style={{ fill: "#0071e3" }} />}
        text="iCloud Settings"
      />
      <ActionItem
        icon={
          <SettingUserIcon className="h-8 w-10" style={{ fill: "#0071e3" }} />
        }
        text="Manage Apple ID"
        extraIcon={
          <LinkArrowIcon
            className="-ml-1 h-7 w-8"
            style={{ fill: "#0071e3" }}
          />
        }
      />
    </div>
    <div className="mb-1 ml-2 mr-2 border-t border-custom"></div>
    <div className="px-1" onClick={handleSignOut}>
      <ActionItem
        icon={<CloseIcon className="h-8 w-10" style={{ fill: "#e30000" }} />}
        text="Sign Out"
        textStyle="text-appleRed"
      />
    </div>
  </>
);

const ActionItem: React.FC<{
  icon: JSX.Element;
  text: string;
  extraIcon?: JSX.Element;
  textStyle?: string;
}> = ({ icon, text, extraIcon, textStyle = "text-black" }) => (
  <div className="mb-1 flex w-full items-center rounded-customHalf hover:bg-appleGray">
    {icon}
    <p className={`text-sm ${textStyle}`}>{text}</p>
    {extraIcon}
  </div>
);
