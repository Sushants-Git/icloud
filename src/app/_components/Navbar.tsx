import Image from "next/image";
import Link from "next/link";
import UserComponent from "./Dashboard/UserComponent";
import ICloudWhiteLogo from "./Images/icloud-white-logo.svg";
import ICloudBlackLogo from "./Images/icloud-black-logo.svg";

// <Image src="/icloud-logo.svg" alt="logo" width={82} height={31} />
interface NavbarProps {
    isforHomeScreen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isforHomeScreen }) => {
    const children: React.ReactNode = (
        <>
            <Link href="/">
                {isforHomeScreen ? (
                    <ICloudWhiteLogo width={82} height={31} />
                ) : (
                    <ICloudBlackLogo width={82} height={31} />
                )}
            </Link>

            <div className="relative cursor-pointer text-white">
                <UserComponent isforHomeScreen={isforHomeScreen} />
            </div>
        </>
    );

    if (isforHomeScreen === false) {
        return (
            <nav className="sticky left-0 top-0 z-50 flex h-44 w-full select-none items-center justify-between px-4 bg-appleNavbarGray">
                {children}
            </nav>
        );
    }

    return (
        <nav className="sticky left-0 top-0 z-50 flex h-44 w-full select-none items-center justify-between bg-[rgba(37,38,40,.21)] bg-custom-radial px-4 backdrop-blur-[14px]">
            {children}
        </nav>
    );
};

export default Navbar;
