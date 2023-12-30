import { useAuth } from '@/hooks/useAuth';
import { axios } from '@/lib/axios';

export function useLogout() {
    const { setToken } = useAuth();

    const logout = async () => {
        setToken('');
        try {
            await axios('/api/logout', {
                withCredentials: true,
            });
        } catch (error) {
            console.error(error);
        }
    };
    return logout;
}
