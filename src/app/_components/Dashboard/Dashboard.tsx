import Image from "next/image";
import Link from "next/link";
import UserComponent from "./UserComponent";

export default function Dashboard() {
  return (
    <main className="h-full w-full bg-sky-500 bg-[url('/main-background.webp')] bg-cover bg-[50%_center]">
      <Navbar />
    </main>
  );
}

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-44 w-full items-center justify-between bg-[rgba(37,38,40,.21)] bg-custom-radial px-4 backdrop-blur-[14px] select-none
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
