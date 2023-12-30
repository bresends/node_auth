import { useAuth } from '@/hooks/useAuth';
import { useRefreshToken } from '@/hooks/useRefreshToken';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export function PersistAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const refresh = useRefreshToken();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!token) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }
    return <Outlet />;
}
