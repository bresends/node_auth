import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface User {
    id: number;
    email: string;
    roles: Roles;
}

export interface Roles {
    name: string;
}

export interface AdminResponse {
    users: User[];
}

export function Admin() {
    const axiosPrivate = useAxiosPrivate();

    const [response, setResponse] = useState<AdminResponse>();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAdminProtectedData = async () => {
            try {
                const response = await axiosPrivate.get<AdminResponse>(
                    '/api/admin',
                    {
                        signal: controller.signal,
                    }
                );
                isMounted && setResponse(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getAdminProtectedData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Admin Page</CardTitle>
                    <CardDescription>
                        This page is only accesible for admins only!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <p>All Users</p>
                    <ul>
                        {response?.users?.map((user: User) => (
                            <li key={user.id}>
                                User {user.id} - {user.email} - Role:{' '}
                                {user.roles.name.toLocaleUpperCase()}
                            </li>
                        ))}
                    </ul>

                    <Link to="/">Go back to the main page</Link>
                    <Link to="/editor">Go to the Editors page</Link>
                    <Link to="/link">Go to the Link page</Link>
                    <Button variant="destructive">
                        <Link to="/logout">Logout</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
