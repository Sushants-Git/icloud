import Link from "next/link";

import ICloudWhiteLogo from "/public/icons/icloud-white-logo.svg";
import ICloudBlackLogo from "/public/icons/icloud-black-logo.svg";

import UserComponent from "./UserComponent";

interface NavbarProps {
  isforHomeScreen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isforHomeScreen }) => {
  const navClassName = isforHomeScreen
    ? "sticky left-0 top-0 z-50 flex h-44 w-full select-none items-center justify-between bg-[rgba(37,38,40,.21)] bg-custom-radial px-4 backdrop-blur-[14px]"
    : "left-0 top-0 z-50 flex h-44 w-full select-none items-center justify-between bg-appleNavbarGray px-4 border-b border-appleGray border-b-1";

  return (
    <nav className={navClassName}>
      <Logo isforHomeScreen={isforHomeScreen} />
      <UserMenu isforHomeScreen={isforHomeScreen} />
    </nav>
  );
};

const Logo: React.FC<{ isforHomeScreen: boolean }> = ({ isforHomeScreen }) => (
  <Link href="/">
    {isforHomeScreen ? (
      <ICloudWhiteLogo width={82} height={31} />
    ) : (
      <ICloudBlackLogo width={82} height={31} />
    )}
  </Link>
);

const UserMenu: React.FC<{ isforHomeScreen: boolean }> = ({
  isforHomeScreen,
}) => (
  <div className="relative cursor-pointer text-white">
    <UserComponent isforHomeScreen={isforHomeScreen} />
  </div>
);

export default Navbar;
