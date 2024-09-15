import Image from "next/image";
import Link from "next/link";
import UserComponent from "./UserComponent";

export default function Dashboard() {
    return (

        // Copilot make the background fixed even though i move my scroll
        <main className="min-h-full w-full bg-sky-500 bg-[url('/main-background.webp')] bg-cover bg-[50%_center] bg-fixed bg-no-repeat">
            <Navbar />

            <div className="container mx-auto p-5 flex flex-wrap gap-5 justify-center">
                <div className="bg-white rounded-lg shadow-lg h-52 w-80"></div>
                <div className="bg-white rounded-lg shadow-lg h-52 w-80 md:w-[630px]"></div>
                <div className="bg-white rounded-lg shadow-lg h-52 w-80 md:w-[630px]"></div>
                <div className="bg-white rounded-lg shadow-lg h-52 w-80"></div>
            </div>
        </main>
    );
}

const Navbar = () => {
    return (
        <nav className="sticky left-0 top-0 z-50 flex h-44 w-full items-center justify-between bg-[rgba(37,38,40,.21)] bg-custom-radial px-4 backdrop-blur-[14px] select-none
    ">
            <Link href="/">
                <Image src="/icloud-logo.svg" alt="logo" width={82} height={31} />
            </Link>

            <div className="relative cursor-pointer text-white">
                <UserComponent />
            </div>
        </nav>
    );
};
