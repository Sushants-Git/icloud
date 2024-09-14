import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    clearUser: () => set({ user: null }),
}));

export default useUserStore;
