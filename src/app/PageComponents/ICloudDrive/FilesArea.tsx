import { getMyFiles } from "~/server/queries";
import FilesList from "./FilesList";
import NoItems from "./NoItems";
import { useState } from "react";
import { create } from "zustand";

export interface openState {
    openForId: string | null;
    changeOpenForId: (id: string | null) => void;
}

export const useOpenStore = create<openState>((set) => ({
    openForId: null,
    changeOpenForId: (id: string | null) =>
        set((state) => {
            if (id === null) {
                return {
                    openForId: null,
                };
            }

            return {
                openForId: state.openForId === id ? null : id,
            };
        }),
}));

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

export default FilesArea;
