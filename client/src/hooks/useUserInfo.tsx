import { useAuth } from '@/hooks/useAuth';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';

export function useUserInfo() {
    const { setRole } = useAuth();

    const axiosPrivate = useAxiosPrivate();

    const getUserInfo = async () => {
        try {
            const { data } = await axiosPrivate.get('/api/user');
            setRole(data.user.role);
            return data.user.role;
        } catch (error) {
            console.error(error);
        }
    };

    return getUserInfo;
}
