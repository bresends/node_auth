import { create } from 'zustand';

interface Session {
    token: string;
    setToken: (time: string) => void;
}

export const useAuthStore = create<Session>()((set) => ({
    token: '',
    setToken: (token) => set({ token }),
}));
