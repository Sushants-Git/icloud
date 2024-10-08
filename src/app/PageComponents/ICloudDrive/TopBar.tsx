import { motion } from "framer-motion";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useEffect, useState } from "react";
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from "uploadthing/client";
import { api } from "~/trpc/react";
import { useUploadThing } from "~/utils/uploadthing";

import {
    List,
    Toggle,
    Upload,
    Download,
    Trash,
    PersonWithPluse,
    Mail,
    Items,
} from "./DriveIcons";

const TopBar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);
    const utils = api.useUtils();

    const { startUpload, routeConfig } = useUploadThing("Uploader", {
        onClientUploadComplete: async () => {
            console.log("uploaded successfully!");
            setFiles([]);
            setIsUploading(false);
            await utils.file.getFiles.invalidate();
        },
        onUploadError: () => {
            console.log("error occurred while uploading");
            setFiles([]);
            setIsUploading(false);
        },
        onUploadBegin: (fileName) => {
            console.log("upload has begun for", fileName);
            setIsUploading(true);
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes,
        ),
    });

    useEffect(() => {
        async function upload() {
            if (files.length > 0) {
                setIsUploading(true);
                await startUpload(files);
            }
        }

        upload().catch((error) => {
            console.error(error);
            setIsUploading(false);
        });
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
                {isUploading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 p-2 border-appleBlue border-t-transparent"></div>
                ) : (
                    <Upload className="h-5 w-5 cursor-pointer rounded-md fill-appleBlue p-2 hover:bg-hoverGray" />
                )}
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

export default TopBar;
