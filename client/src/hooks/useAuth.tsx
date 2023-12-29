import { useAuthStore } from '@/store/userStore';

export const useAuth = () => {
    const setToken = useAuthStore((state) => state.setToken);
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);
    const setRole = useAuthStore((state) => state.setRole);

    return { token, setToken, role, setRole };
};
