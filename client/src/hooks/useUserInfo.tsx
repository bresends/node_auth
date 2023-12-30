import { useAuth } from '@/hooks/useAuth';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';

export function useUserInfo() {
    const { setRole } = useAuth();

    const axiosPrivate = useAxiosPrivate();

    const getUserInfo = async () => {
        try {
            const { data } = await axiosPrivate.get('/api/user');
            console.log('getUserInfo', data);
            setRole(data.user.roles.name);
            return data.user.roles.name;
        } catch (error) {
            console.error(error);
        }
    };

    return getUserInfo;
}
