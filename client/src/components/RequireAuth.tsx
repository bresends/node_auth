import { useAuth } from '@/hooks/useAuth';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type Props = {
    authorizedRoles: string[];
};

export default RequireAuth;

export function RequireAuth({ authorizedRoles }: Props) {
    const { token, role, setRole } = useAuth();
    const location = useLocation();
    const getUserRole = useUserInfo();

    useEffect(() => {
        const getRole = async () => {
            try {
                const role = await getUserRole();
                setRole(role);
            } catch (error) {
                console.error(error);
            }
        };

        if (token && !role) {
            getRole();
        }
    }, []);

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (token && !role) {
        return <p>Loading...</p>;
    }

    if (token && !authorizedRoles.includes(role)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }

    return <Outlet />;
}
