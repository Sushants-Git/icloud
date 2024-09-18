import { create } from "zustand";

export interface fetchedFiles {
    date: Date | null;
    id: string;
    name: string;
    userId: string;
    type: string;
    size: number;
    url: string;
}

export interface filesState {
    fetchedFiles: fetchedFiles[];
    removeFile: (openForId: string) => void;
    setFetchedFiles: (files: fetchedFiles[]) => void;
}

// export const useFilesStore = create<filesState>((set) => ({
//   fetchedFiles: [],
//   setFetchedFiles: (files: fetchedFiles[]) => set({ fetchedFiles: files }),
// }));

// fetchedFiles.filter((file) => file.id !== openForId),

export const useFilesStore = create<filesState>((set) => ({
    fetchedFiles: [],
    removeFile: (openForId: string) => {
        set((state) => ({
            fetchedFiles: state.fetchedFiles.filter((file) => file.id !== openForId),
        }));
    },
    setFetchedFiles: (files: fetchedFiles[]) => set({ fetchedFiles: files }),
}));
