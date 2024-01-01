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

import { useToast } from '@/components/ui/use-toast';
import { passwordResetRequest } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const createUserFormSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export function ForgotPassword() {
    const form = useForm<z.infer<typeof createUserFormSchema>>({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: {
            email: '',
        },
    });

    const { toast } = useToast();

    useEffect(() => {
        form.setFocus('email');
    }, [form.setFocus]);

    async function onSubmit(data: z.infer<typeof createUserFormSchema>) {
        try {
            const res = await passwordResetRequest(data.email);

            console.log(res);

            toast({
                title: 'Password Reset Requested',
                description: 'Check your email for a password reset link.',
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                form.setError('email', {
                    message: 'Unauthorized',
                });
                if (error instanceof Error) {
                    form.setError('email', {
                        message: '',
                    });
                }
            }
            if (error instanceof AxiosError && error.response?.status === 404) {
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: 'Please check the email address.',
                });
            }
        }
    }

    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Forgot you password</CardTitle>
                    <CardDescription>
                        Please enter the email address you would like to your
                        password reset link sent to.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid items-center gap-6 mb-4"
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

                            <Button type="submit" className="w-full">
                                Request Password Reset
                            </Button>
                        </form>
                    </Form>
                    {/* // Create a link to the login page */}
                    <div className="mt-4">
                        <p className="text-slate-500 text-sm">
                            Want to go back?{' '}
                            <Link
                                to="/login"
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
