import { create } from "zustand";

interface ApiKeyState {
    apiKey: string | null;
    setApiKey: (newApiKey: string) => void;
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
    apiKey: null,
    setApiKey: (newApiKey: string) => set({ apiKey: newApiKey }),
}));
