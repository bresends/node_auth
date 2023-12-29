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

export function Admin() {
    const axiosPrivate = useAxiosPrivate();

    const [response, setResponse] = useState('');

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAdmin = async () => {
            try {
                const response = await axiosPrivate.get('/api/admin', {
                    signal: controller.signal,
                });
                console.log(response.data);
                isMounted && setResponse(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getAdmin();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    console.log(response);

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
                    <Link to="/">Go back to the main page</Link>
                    <Link to="/editor">Go to the Editors page</Link>
                    <Link to="/link">Go to the Link page</Link>
                    <Link to="/logout">Logout</Link>
                </CardContent>
            </Card>
        </main>
    );
}
