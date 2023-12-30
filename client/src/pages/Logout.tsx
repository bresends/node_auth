import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useLogout } from '@/hooks/useLogout';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const logout = useLogout();
    const navigate = useNavigate();

    const signOut = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Logout</CardTitle>
                    <CardDescription>
                        Are you sure you want to logout?
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <Button variant="destructive" onClick={signOut}>
                        <LogOut size={20} />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
