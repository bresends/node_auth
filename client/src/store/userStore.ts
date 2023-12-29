import { create } from 'zustand';

interface Session {
    token: string;
    role: string;
    setToken: (time: string) => void;
    setRole: (role: string) => void;
}

export const useAuthStore = create<Session>()((set) => ({
    token: '',
    role: '',
    setToken: (token) => set({ token }),
    setRole: (role) => set({ role }),
}));
