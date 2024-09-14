import { create } from 'zustand';

interface ApiKeyStoreState {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
    clearApiKey: () => void;
}

export const useApiKeyStore = create<ApiKeyStoreState>((set) => ({
    apiKey: null,
    setApiKey: (key: string | null) => set({ apiKey: key }),
    clearApiKey: () => set({ apiKey: null }),
}));
