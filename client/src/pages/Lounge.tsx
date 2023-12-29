import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

export function Lounge() {
    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Lounge Page</CardTitle>
                    <CardDescription>
                        This page is accessible by all users but only the admin
                        and editor can edit.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <Link to="/">Go back to the main page</Link>
                    <Link to="/admin">Go to the Admin page</Link>
                    <Link to="/editor">Go to the Editor page</Link>
                    <Link to="/logout">Logout</Link>
                </CardContent>
            </Card>
        </main>
    );
}
