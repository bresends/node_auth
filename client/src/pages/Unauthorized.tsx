import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Unauthorized</CardTitle>
                    <CardDescription>
                        Sorry, you do not have access to the requested page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <Link to="/">Go back to the main page!</Link>
                </CardContent>
            </Card>
        </main>
    );
}
