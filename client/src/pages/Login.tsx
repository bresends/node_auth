import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { useAuth } from '@/hooks/useAuth';
import { axios, loginRequest } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

const createUserFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string(),
});

export function Login() {
    const form = useForm<z.infer<typeof createUserFormSchema>>({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { setToken, setRole } = useAuth();

    const { toast } = useToast();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        form.setFocus('email');
    }, [form.setFocus]);

    async function onSubmit(data: z.infer<typeof createUserFormSchema>) {
        try {
            const response = await loginRequest(data.email, data.password);
            const user = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${response.accessToken}`,
                },
            });
            navigate(from, { replace: true });
            setToken(response.accessToken);
            setRole(user.data.user.roles.name);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                toast({
                    variant: 'destructive',
                    title: 'Unauthorized',
                    description: 'Please check your credentials',
                });
            }
        }
    }

    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your creditials to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid items-center gap-3"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                id="email"
                                                placeholder="example@google.com"
                                                autoComplete="off"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                id="password"
                                                placeholder="********"
                                                autoComplete="off"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Create a link to Forgot Password */}

                            <p className="text-slate-500 text-[13px] text-right mt-[-12px] mb-3">
                                Forgot Password?{' '}
                                <Link
                                    to="/forgot_password"
                                    className="underline hover:text-slate-700"
                                >
                                    Click here
                                </Link>
                            </p>

                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </Form>
                    {/* // Create a link to the login page */}
                    <div className="mt-4">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="underline hover:text-slate-700"
                            >
                                Click here
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
