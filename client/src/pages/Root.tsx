import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

export function Root() {
    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Home</CardTitle>
                    <CardDescription>Your are logged in!</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <Link to="/editor">Go to the editor page</Link>
                    <Link to="/admin">Go to the Admin page</Link>
                    <Link to="/lounge">Go to the Lounge page</Link>
                    <Link to="/link">Go to the Link page</Link>
                    <Link to="/logout">Logout</Link>
                </CardContent>
            </Card>
        </main>
    );
}
