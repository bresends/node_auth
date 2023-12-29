import { axios } from '@/lib/axios';
import { useAuth } from './useAuth';

export function useRefreshToken() {
    const { setToken } = useAuth();

    const refresh = async () => {
        const { data } = await axios.get('/api/refresh_token', {
            withCredentials: true,
        });

        setToken(data.accessToken);

        return data.accessToken;
    };

    return refresh;
}
