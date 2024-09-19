import Image from "next/image";
import Link from "next/link";

import ClockSvg from "/public/clock.svg";
import PdfSvg from "/public/drive-icons/pdf.svg";
import TextSvg from "/public/drive-icons/text.svg";
import ImageSvg from "/public/drive-icons/image.svg";
import FirstUploadSvg from "/public/drive-icons/upload-your-first.svg";
import { Browse } from "../PageComponents/ICloudDrive/DriveIcons";

import Navbar from "./common/Navbar";
import { useFiles } from "~/hooks/useFiles";
import React, { useEffect } from "react";
import { fetchedFiles } from "~/stores/useFilesStore";
import { api } from "~/trpc/react";
import { useNotesStore } from "~/stores/useNotesStore";
import { useSession } from "next-auth/react";
import NotesMeta from "../PageComponents/ICloudNotes/NoteMeta";

const boxEffect = "h-[315px] w-[315px] rounded-[16px] bg-white";
const transaction =
    "transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-400/50";

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

const Box: React.FC<BoxProps> = ({
    children,
    additionalClasses = "",
    hasPointer = false,
}) => (
    <div
        className={`${boxEffect} ${transaction} ${additionalClasses} ${hasPointer ? "cursor-pointer" : ""}`}
    >
        {children}
    </div>
);

const GridLayout = () => (
    <div className="container mx-auto flex flex-wrap justify-center gap-[30px] px-10 pb-[95px] pt-[60px]">
        <div className="flex flex-col gap-8 lg:flex-row">
            <Box additionalClasses="lg:w-[315px]" hasPointer={true}>
                <div></div>
            </Box>
            <Box additionalClasses="lg:w-[630px]">
                <div></div>
            </Box>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
            <Box additionalClasses="lg:w-[630px]">
                <DriveComponent />
            </Box>
            <Box additionalClasses="lg:w-[315px]">
                <NotesComponent />
            </Box>
        </div>
    </div>
);

const DriveComponent = () => {
    const { fetchedFiles } = useFiles();

    return (
        <>
            <div className="flex h-20 rounded-t-[16px] bg-appleGrayishBlue">
                <Link href="/iclouddrive" className="flex w-full rounded-t-[16px]">
                    <div className="m-2 flex w-full items-center rounded-[8px] px-1 pl-4 hover:bg-appleDarkGray">
                        <Image
                            src="/icloud-drive-logo.png"
                            className="block"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                        <div className="ml-3 flex flex-col">
                            <p className="-mb-0.5 text-xl font-semibold">Drive</p>
                            <p className="flex items-center gap-0.5 text-sm text-appleGray">
                                <ClockSvg className="h-3 w-4" style={{ fill: "#0071e3" }} />
                                Recents
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
            {fetchedFiles.length === 0 ? (
                <Link href="/iclouddrive">
                    <div className="flex h-[235px] w-full flex-col items-center justify-center">
                        <FirstUploadSvg className="h-16 w-16 fill-appleBlue" />
                        <p>Upload your first file</p>
                    </div>
                </Link>
            ) : (
                <>
                    <div className="mt-5 flex">
                        <div className="w-1/2 flex-grow pl-2 pr-2">
                            {FirstNFiles({ from: 0, to: 3, files: fetchedFiles })}
                        </div>
                        <div className="w-1/2 flex-grow border-l border-l-appleGray pl-2 pr-2">
                            {FirstNFiles({ from: 3, to: 6, files: fetchedFiles })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

const NotesComponent = () => {
    const { setNotes, notes } = useNotesStore();

    const { data: session } = useSession();

    const fetchedNotes = api.notes.getNotes.useQuery(undefined, {
        enabled: !!session,
    });

    useEffect(() => {
        if (fetchedNotes.data) {
            setNotes(fetchedNotes.data.notes);
        }
    }, [fetchedNotes.data]);

    return (
        <>
            <div className="flex h-20 rounded-t-[16px] bg-appleGrayishBlue">
                <Link href="/icloudnotes" className="flex w-full rounded-t-[16px]">
                    <div className="m-2 flex w-full items-center rounded-[8px] px-1 pl-4 hover:bg-appleDarkGray">
                        <Image
                            src="/icloud-notes-logo.png"
                            className="block"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                        <div className="ml-3 flex flex-col">
                            <p className="-mb-0.5 text-xl font-semibold">Notes</p>
                            <p className="flex items-center gap-0.5 text-sm text-appleGray">
                                <Browse className="mr-1 h-3 w-4 fill-appleYellow" />
                                Browse
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
            {fetchedNotes?.data?.notes?.length === 0 ? (
                <Link href="/icloudnotes">
                    <div className="flex h-[235px] w-full flex-col items-center justify-center">
                        <FirstUploadSvg className="h-16 w-16 fill-appleYellow" />
                        <p>Create your first note</p>
                    </div>
                </Link>
            ) : (
                <>
                    <div className="mt-5 flex">
                        <div className="flex w-full flex-grow flex-col gap-2 pl-2 pr-2">
                            {notes.slice(0, 2).map((note) => (
                                <NotesMeta
                                    key={note.id}
                                    id={note.id}
                                    title={note.title}
                                    date={note.date}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

const FirstNFiles: React.FC<{
    from: number;
    to: number;
    files: fetchedFiles[];
}> = ({ from, to, files }) => {
    return (
        <div className="flex flex-col gap-6">
            {files.slice(from, to).map((file) => (
                <FileItem key={file.id} file={file} />
            ))}
        </div>
    );
};

const FileItem: React.FC<{ file: fetchedFiles }> = ({ file }) => {
    let logo = null;

    const fileType = file.type;

    switch (true) {
        case String(fileType).includes("text"):
            logo = <TextSvg className="h-5 fill-applePurple" />;
            console.log("The file is a text file.");
            break;
        case String(fileType).includes("image"):
            logo = <ImageSvg className="h-5 fill-appleYellow" />;
            break;
        case String(fileType).includes("pdf"):
            logo = <PdfSvg className="h-5 fill-appleRed" />;
            break;
        default:
            console.log("Unknown file type.");
    }

    return (
        <Link href={file.url} target="_blank">
            <div className="flex cursor-pointer items-center gap-4 pl-4 pr-4 hover:rounded-lg hover:bg-appleGray">
                <div>{logo}</div>
                <div>
                    <div className="line-clamp-1 break-all text-base">{file.name}</div>
                    <div className="text-sm font-regular text-appleTableGray">
                        {file.type}
                    </div>
                </div>
            </div>
        </Link>
    );
};

// <div class="max-w-2xl mx-auto grid grid-cols-2 gap-4">
//     <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
//         <div class="w-8 h-8 bg-purple-600 rounded"></div>
//         <div>
//             <p class="font-bold">LICENSE</p>
//             <p class="text-sm text-gray-500">File</p>
//         </div>
//     </div>
//     <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
//         <div class="w-8 h-8 bg-yellow-400 rounded"></div>
//         <div>
//             <p class="font-bold">imresizer-1726081894837</p>
//             <p class="text-sm text-gray-500">JPG</p>
//         </div>
//     </div>
//     <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
//         <div class="w-8 h-8 bg-purple-600 rounded"></div>
//         <div>
//             <p class="font-bold">DEVELOPMENT</p>
//             <p class="text-sm text-gray-500">MD</p>
//         </div>
//     </div>
//     <div class="bg-white p-4 rounded-lg flex items-center space-x-3">
//         <div class="w-8 h-8 bg-red-500 rounded"></div>
//         <div>
//             <p class="font-bold">CodeDay Hyderabad Partnership</p>
//             <p class="text-sm text-gray-500">PDF</p>
//         </div>
//     </div>
// </div>

// import { FileIcon, ImageIcon, FileTextIcon } from "lucide-react"

// export default function Component() {
//   return (
//     <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//       <ul className="divide-y divide-gray-200">
//         <li className="flex items-center px-4 py-3">
//           <FileTextIcon className="h-6 w-6 text-purple-500 mr-3" />
//           <div>
//             <p className="text-sm font-medium text-gray-900">DEVELOPMENT</p>
//             <p className="text-xs text-gray-500">MD</p>
//           </div>
//         </li>
//         <li className="flex items-center px-4 py-3">
//           <FileIcon className="h-6 w-6 text-red-500 mr-3" />
//           <div>
//             <p className="text-sm font-medium text-gray-900">CodeDay Hyderabad Partnership</p>
//             <p className="text-xs text-gray-500">PDF</p>
//           </div>
//         </li>
//         <li className="flex items-center px-4 py-3">
//           <ImageIcon className="h-6 w-6 text-yellow-500 mr-3" />
//           <div>
//             <p className="text-sm font-medium text-gray-900">imresizer-1726081894837</p>
//             <p className="text-xs text-gray-500">JPG</p>
//           </div>
//         </li>
//       </ul>
//     </div>
//   )
// }
