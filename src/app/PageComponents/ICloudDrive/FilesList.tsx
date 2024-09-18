import { getMyFiles } from "~/server/queries";
import { getFormattedTimestamp, humanReadableSize } from "~/utils/util";

import PdfSvg from "/public/drive-icons/pdf.svg";
import TextSvg from "/public/drive-icons/text.svg";
import { Delete, Select } from "./DriveIcons";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOpenStore } from "./FilesArea";
import { api } from "~/trpc/react";
import { useFilesStore } from "~/stores/useFilesStore";

const FilesList: React.FC<{
    files: Awaited<ReturnType<typeof getMyFiles>>;
}> = ({ files }) => {
    const headStyle =
        "pb-3 w-[20%] pl-4 text-left text-sm font-regular text-appleTableGray";

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
                        <FileRow key={file.id} file={file} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface FileRowProps {
    file: {
        id: string;
        name: string;
        type: string;
        size: number;
        url: string;
        date: Date | null;
    };
}

const FileRow: React.FC<FileRowProps> = ({ file }) => {
    let logo = null;

    const fileType = file.type;

    switch (true) {
        case String(fileType).includes("text"):
            logo = <TextSvg className="h-5 fill-applePurple" />;
            console.log("The file is a text file.");
            break;
        case String(fileType).includes("image"):
            logo = (
                <Image src={file.url} height={20} width={20} alt="The uploaded image" />
            );
            break;
        case String(fileType).includes("pdf"):
            logo = <PdfSvg className="h-5 fill-appleRed" />;
            break;
        default:
            console.log("Unknown file type.");
    }

    return (
        <tr
            className="w-[calc(100%-36px)] border-b border-b-appleGray hover:bg-appleDarkGray"
            onClick={() => window.open(file.url, "_blank")}
        >
            <td
                className="w-[46px] select-none py-3 pl-4 pr-2 text-left"
                data-id={file.id}
            >
                {logo}
            </td>
            <FileCell
                className="select-none pl-4"
                content={file.name}
                smallText={false}
            />
            <FileCell className="select-none pl-4" content={file.type} />
            <FileCell
                className="select-none pl-4"
                content={humanReadableSize(file.size)}
            />
            <FileCell
                className="select-none pl-4"
                content={getFormattedTimestamp(file.date)}
            />
            <FileCell className="select-none pl-4" content="" />
            <td>
                <FilePopup id={file.id} />
            </td>
        </tr>
    );
};

const FilePopup: React.FC<{ id: string }> = ({ id }) => {
    const { openForId, changeOpenForId } = useOpenStore();

    return (
        <div className="relative">
            <Select
                className="z-0 h-[46px] w-[46px] cursor-pointer fill-appleSelectGray py-3 pl-4 pr-2 text-left"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    changeOpenForId(id);
                }}
            />
            <AnimatePresence>
                {openForId === id && (
                    <motion.div
                        className="absolute right-0 z-10 w-60 rounded-custom border border-appleGray bg-white shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ transformOrigin: "top right" }}
                    >
                        <UserActions />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UserActions: React.FC = () => {
    const { openForId, changeOpenForId } = useOpenStore();

    const { removeFile } = useFilesStore();
    const deleteFileMutation = api.file.deleteFile.useMutation();

    const utils = api.useUtils();

    return (
        <>
            <div
                className="flex cursor-pointer px-1"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    changeOpenForId(null);
                    if (openForId) {
                        console.log(openForId);
                        deleteFileMutation
                            .mutateAsync({ fileId: openForId })
                            .then(async () => {
                                await utils.file.getFiles.invalidate();
                            })
                            .catch((error) => {
                                console.error("Error deleting file:", error);
                            });
                        removeFile(openForId);
                    }
                }}
            >
                <ActionItem
                    icon={<Delete className="h-8 w-10 fill-appleRed" />}
                    text="Delete"
                    textStyle="text-appleRed"
                />
            </div>
        </>
    );
};

const ActionItem: React.FC<{
    icon: JSX.Element;
    text: string;
    extraIcon?: JSX.Element;
    textStyle?: string;
}> = ({ icon, text, extraIcon, textStyle = "text-black" }) => (
    <div className="z-10 mb-1 mt-1 flex w-full items-center gap-2 rounded-customHalf bg-white p-2 hover:bg-appleGray">
        {icon}
        <p className={`text-sm ${textStyle} select-none`}>{text}</p>
        {extraIcon}
    </div>
);

interface FileCellProps {
    className: string;
    content: string;
    smallText?: boolean;
}

const FileCell: React.FC<FileCellProps> = ({
    className,
    content,
    smallText = true,
}) => {
    return (
        <td className={className}>
            {smallText ? (
                <span className="line-clamp-1 break-all text-sm font-regular text-appleTableGray">
                    {content}
                </span>
            ) : (
                <span className="line-clamp-1 break-all">{content}</span>
            )}
        </td>
    );
};

export default FilesList;
