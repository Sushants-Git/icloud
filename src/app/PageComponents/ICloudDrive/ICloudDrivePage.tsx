import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Navbar from "../../_components/common/Navbar";
import { useState } from "react";

export default function ICloudDrivePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    const toggleSidebar = () => setIsSidebarOpen((prevValue) => !prevValue);

    return (
        <div className="flex h-full flex-col">
            <Navbar isforHomeScreen={false} withTitle={"Drive"} />
            <div className="flex w-full flex-grow bg-gray-100">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <MainContent isSidebarOpen={isSidebarOpen} />
            </div>
        </div>
    );
}