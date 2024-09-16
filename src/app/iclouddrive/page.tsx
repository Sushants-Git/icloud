"use client";

import { useState } from "react";
import Navbar from "~/app/_components/Navbar";
import {
    Clock,
    FolderOpen,
    Trash2,
    List,
    ChevronUp,
    Cloud,
    Trash,
    RotateCcw,
    Mail,
    Settings,
    Menu,
} from "lucide-react";

export default function ICloudDrivePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div>
        <Navbar isforHomeScreen={false}/>
            <div>
                <div className="flex h-screen bg-gray-100">
                    {/* Sidebar */}
                    <div
                        className={`${isSidebarOpen ? "w-64" : "w-16"} border-r bg-white transition-all duration-300 ease-in-out`}
                    >
                        <div className="p-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="mb-4 rounded-md p-2 transition-colors duration-200 hover:bg-gray-100"
                            >
                                <Menu className="h-5 w-5 text-gray-600" />
                            </button>
                            <div className="flex items-center space-x-2 rounded-md bg-gray-200 p-2">
                                <Clock className="h-5 w-5 text-gray-600" />
                                {isSidebarOpen && <span className="font-medium">Recents</span>}
                            </div>
                            <div className="mt-2 flex items-center space-x-2 p-2">
                                <FolderOpen className="h-5 w-5 text-gray-600" />
                                {isSidebarOpen && <span>Browse</span>}
                            </div>
                            <div className="flex items-center space-x-2 p-2">
                                <Trash2 className="h-5 w-5 text-gray-600" />
                                {isSidebarOpen && <span>Recently Deleted</span>}
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-1 flex-col">
                        {/* Top bar */}
                        <div className="flex items-center justify-between border-b bg-white p-4">
                            <div className="flex items-center space-x-2">
                                <List className="h-5 w-5 text-gray-600" />
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Cloud className="h-5 w-5 text-gray-600" />
                                <Trash className="h-5 w-5 text-gray-600" />
                                <RotateCcw className="h-5 w-5 text-gray-600" />
                                <Mail className="h-5 w-5 text-gray-600" />
                                <Settings className="h-5 w-5 text-gray-600" />
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 p-8">
                            <h1 className="mb-2 text-2xl font-semibold">Recents</h1>
                            <p className="mb-8 text-sm text-gray-500">
                                0 items, 1 GB available
                            </p>
                            <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
                                <h2 className="mb-4 text-3xl font-semibold text-gray-400">
                                    No items
                                </h2>
                                <p className="text-gray-400">
                                    Files which youve opened recently will appear here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
