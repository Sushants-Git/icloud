import Image from "next/image";
import Link from "next/link";

import ClockSvg from "/public/clock.svg";

import Navbar from "./common/Navbar";

const boxEffect = "h-[315px] w-[315px] rounded-[16px] bg-white";
const transaction = "transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-400/50";

export default function Dashboard() {
    return (
        <main className="min-h-full w-full bg-sky-500 bg-[url('/main-background.webp')] bg-cover bg-fixed bg-[50%_center] bg-no-repeat">
            <Navbar isforHomeScreen={true} />
            <GridLayout />
        </main>
    );
}

interface BoxProps {
    children: React.ReactNode;
    additionalClasses?: string;
    hasPointer?: boolean;
}

const Box: React.FC<BoxProps> = ({ children, additionalClasses = "", hasPointer = false }) => (
    <div className={`${boxEffect} ${transaction} ${additionalClasses} ${hasPointer ? 'cursor-pointer' : ''}`}>
        {children}
    </div>
);

const GridLayout = () => (
    <div className="container mx-auto flex flex-wrap justify-center gap-[30px] px-10 pb-[95px] pt-[60px]">
        <div className="flex flex-col gap-8 lg:flex-row">
            <Box additionalClasses="lg:w-[315px]" hasPointer={true} >
                <div></div>
            </Box>
            <Box additionalClasses="lg:w-[630px]" >
                <div></div>
            </Box>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
            <Box additionalClasses="lg:w-[630px]" >
                <DriveComponent />
            </Box>
            <Box additionalClasses="lg:w-[315px]" >
                <div></div>
            </Box>
        </div>
    </div>
);

const DriveComponent = () => {
    return (
        <div className="flex h-20 rounded-t-[16px] bg-appleGrayishBlue">
            <Link
                href="/iclouddrive"
                className="flex w-full rounded-t-[16px]"
            >
                <div className="m-2 flex w-full items-center rounded-[8px] hover:bg-appleDarkGray px-1 pl-4">
                    <Image
                        src="/icloud-drive-logo.png"
                        className="block"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col ml-3">
                        <p className="text-xl font-semibold -mb-0.5">Drive</p>
                        <p className="flex items-center text-sm text-appleGray gap-0.5">
                            <ClockSvg className="h-3 w-4" style={{ fill: "#0071e3" }} />
                            Recents
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};
