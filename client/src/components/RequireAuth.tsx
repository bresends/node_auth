import { useAuth } from '@/hooks/useAuth';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type Props = {
    authorizedRoles: string[];
};

export default RequireAuth;

export function RequireAuth({ authorizedRoles }: Props) {
    const { token, role, setRole } = useAuth();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await axiosPrivate.get('/api/user', {
                    signal: controller.signal,
                });
                isMounted && setRole(response.data.user.roles.name);
            } catch (error) {
                console.log(error);
            }
        };

        getUser();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (token && !authorizedRoles.includes(role)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }

    return <Outlet />;
}
