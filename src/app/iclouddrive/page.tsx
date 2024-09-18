"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from "uploadthing/client";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "~/utils/uploadthing";

import { motion, AnimatePresence } from "framer-motion";

import SidebarIcon from "/public/drive-icons/sidebar.svg";
import Browse from "/public/drive-icons/browse.svg";
import Clock from "/public/drive-icons/recents.svg";
import Trash from "/public/drive-icons/delete.svg";
import Items from "/public/drive-icons/items.svg";
import Mail from "/public/drive-icons/email.svg";
import Download from "/public/drive-icons/download.svg";
import PersonWithPluse from "/public/drive-icons/person-with-plus.svg";
import Toggle from "/public/drive-icons/view.svg";
import List from "/public/drive-icons/list.svg";
import Upload from "/public/drive-icons/upload.svg";

import useApiKey from "~/hooks/useApiKey";

import Navbar from "~/app/_components/common/Navbar";
import { getMyFiles } from "~/server/queries";
import { api } from "~/trpc/react";
import { files } from "~/server/db/schema";
import PdfSvg from "/public/drive-icons/pdf.svg";
import { useSession } from "next-auth/react";
import { getFormattedTimestamp, humanReadableSize } from "~/utils/util";
import { useRouter } from "next/navigation";

export default function ICloudDrivePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    useApiKey();

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

const Sidebar: React.FC<{
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}> = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <div className="relative bg-appleSidebarblue">
            <button
                onClick={toggleSidebar}
                className="absolute left-4 top-[11px] z-10 rounded-md p-2 transition-colors duration-200 hover:bg-appleGray"
            >
                <SidebarIcon className="h-5 w-5 fill-appleBlue" />
            </button>
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 256 }} // 64 * 4 = 256px
                        exit={{ width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="w-64 border-r border-r-appleGray">
                            <div className="p-4 pb-0 pt-[11px]">
                                <div className="h-9 w-9" /> {/* Placeholder for the button */}
                                <SidebarItem
                                    icon={<Clock className="h-4 w-4 fill-appleBlue" />}
                                    label="Recents"
                                />
                                <SidebarItem
                                    icon={<Browse className="h-5 w-5 fill-appleBlue" />}
                                    label="Browse"
                                />
                                <SidebarItem
                                    icon={<Trash className="h-5 w-5 fill-appleBlue" />}
                                    label="Recently Deleted"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SidebarItem: React.FC<{
    icon: JSX.Element;
    label: string;
}> = ({ icon, label }) => {
    let extraStyle = "";

    if (label === "Recents") {
        extraStyle = "mt-4";
    }

    return (
        <div
            className={`flex cursor-pointer items-center space-x-2 rounded-[10px] p-2 hover:bg-appleGray ${extraStyle}`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </div>
    );
};

const MainContent: React.FC<{ isSidebarOpen: boolean }> = ({
    isSidebarOpen,
}) => (
    <div className="flex w-full flex-col">
        <TopBar isSidebarOpen={isSidebarOpen} />
        <ContentArea />
    </div>
);

const TopBar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [files, setFiles] = useState<File[]>([]);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);
    const utils = api.useUtils();

    const { startUpload, routeConfig } = useUploadThing("Uploader", {
        onClientUploadComplete: () => {
            console.log("uploaded successfully!");
            setFiles([]);
            utils.file.getFiles.invalidate();
        },
        onUploadError: () => {
            console.log("error occurred while uploading");
            setFiles([]);
        },
        onUploadBegin: (fileName) => {
            console.log("upload has begun for", fileName);
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes,
        ),
    });

    useEffect(() => {
        if (files.length > 0) {
            startUpload(files);
        }
    }, [files]);

    return (
        <motion.div
            initial={false}
            animate={{ paddingLeft: isSidebarOpen ? "1rem" : "4rem" }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-between bg-white p-4"
        >
            <div className="flex items-center space-x-4">
                <List className="h-5 w-5 fill-appleBlue" />
                <Toggle className="h-4 w-3 fill-appleBlue" />
            </div>

            <div {...getRootProps()}>
                {!(files.length > 0) && <input {...getInputProps()} />}
                <Upload className="h-5 w-5 cursor-pointer rounded-md fill-appleBlue p-2 hover:bg-hoverGray" />
            </div>

            <div className="flex items-center space-x-4">
                <Download className="h-5 w-5 fill-appleBlue" />
                <Trash className="h-5 w-5 fill-appleBlue" />
                <PersonWithPluse className="h-5 w-5 fill-appleBlue" />
                <Mail className="h-5 w-5 fill-appleBlue" />
                <Items className="h-5 w-5 fill-appleBlue" />
            </div>
        </motion.div>
    );
};

const ContentArea: React.FC = () => {
    const { data: session } = useSession();

    let fetchedFiles = api.file.getFiles.useQuery(undefined, {
        enabled: !!session,
    });

    return (
        <div className="flex flex-grow flex-col bg-white p-8 pt-4">
            <div>
                <h1 className="mb-2 flex items-center gap-3 text-2xl font-semibold">
                    <Clock className="h-5 w-5 fill-[#0000007a]" />
                    Recents
                </h1>
                <p className="mb-8 text-sm text-gray-500">
                    {fetchedFiles.data?.files.length ?? 0} items, 1 GB available
                </p>
            </div>

            <FilesArea files={fetchedFiles.data?.files} />
        </div>
    );
};

const FilesArea: React.FC<{
    files: Awaited<ReturnType<typeof getMyFiles>> | undefined;
}> = ({ files }) => {
    if (files?.length) {
        return (
            <div className="w-full">
                <FilesList files={files} />
            </div>
        );
    }

    return (
        <div className="flex flex-grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <NoItems />
            </div>
        </div>
    );
};

const FilesList: React.FC<{
    files: Awaited<ReturnType<typeof getMyFiles>>;
}> = ({ files }) => {
    let headStyle =
        "pb-3 w-[20%] pl-4 text-left text-sm font-regular text-appleTableGray";

    let bodyStyle = "w-[20%] pl-4 text-left text-base truncate";

    return (
        <div className="w-full">
            <table>
                <thead>
                    <tr className="w-[calc(100%-36px)] border-b border-b-appleGray">
                        <th className="w-[46px] pb-3 pl-4 pr-2 text-left"></th>
                        <th className={headStyle}>Name</th>
                        <th className={headStyle}>Kind</th>
                        <th className={headStyle}>Size</th>
                        <th className={headStyle}>Date</th>
                        <th className={headStyle}>Shared</th>
                        <th className={headStyle}></th>
                    </tr>
                </thead>
                <tbody className="w-[calc(100%-36px)]">
                    {files.map((file) => (
                        <tr className="w-[calc(100%-36px)] border-b border-b-appleGray">
                            <td className="w-[46px] py-3 pl-4 pr-2 text-left">
                                <PdfSvg className="fill-appleRed" />
                            </td>
                            <td className="pl-4">
                                <span className="line-clamp-1 break-all">{file.name}</span>
                            </td>
                            <td className="pl-4">
                                <span className="line-clamp-1 break-all text-sm font-regular text-appleTableGray">
                                    {file.type}
                                </span>
                            </td>
                            <td className="pl-4">
                                <span className="line-clamp-1 break-all text-sm font-regular text-appleTableGray">
                                    {humanReadableSize(file.size)}
                                </span>
                            </td>
                            <td className="pl-4">
                                <span className="line-clamp-1 break-all text-sm font-regular text-appleTableGray">
                                    {getFormattedTimestamp(file.date)}
                                </span>
                            </td>
                            <td className="pl-4">
                                <span className="line-clamp-1 break-all text-sm font-regular text-appleTableGray"></span>
                            </td>
                            <td className={bodyStyle}>
                                <span></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const NoItems: React.FC = () => (
    <>
        <h2 className="mb-4 text-3xl font-semibold text-gray-400">No items</h2>
        <p className="text-gray-400">
            Files which youve opened recently will appear here.
        </p>
    </>
);
