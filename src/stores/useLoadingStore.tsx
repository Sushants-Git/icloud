import { create } from "zustand";

interface LoadingState {
    isLoading: boolean;
    setLoading: (loadingState: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    isLoading: false,
    setLoading: (loadingState) => set({ isLoading: loadingState }),
}));
