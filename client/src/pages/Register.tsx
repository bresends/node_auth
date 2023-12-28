import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { registerRequest } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const createUserFormSchema = z
    .object({
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .regex(
                PWD_REGEX,
                'Password should contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character (!@#$%).'
            )
            .min(8, 'Password should contain at least 8 characters.'),
        confirm_password: z.string().min(8, 'Confirm password is required'),
        terms: z.literal(true, {
            errorMap: () => ({
                message: 'You must accept the terms & conditions',
            }),
        }),
    })
    .refine(({ password, confirm_password }) => password === confirm_password, {
        message: "Passwords doesn't match",
        path: ['confirm_password'],
    });

export function Register() {
    const form = useForm<z.infer<typeof createUserFormSchema>>({
        resolver: zodResolver(createUserFormSchema),
        defaultValues: {
            email: '',
            password: '',
            confirm_password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof createUserFormSchema>) {
        try {
            await registerRequest(data.email, data.password);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 409) {
                form.setError('email', {
                    message: 'This email is already being used.',
                });
            } else if (error instanceof Error) {
                form.setError('confirm_password', {
                    message: 'Something went wrong. Please try again.',
                });
            }
        }
    }

    useEffect(() => {
        form.setFocus('email');
    }, [form.setFocus]);

    return (
        <main className="flex justify-center items-center h-[100dvh]">
            <Card className="w-96 p-3">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Create an account to get started
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

                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirm_password">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                id="confirm_password"
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

                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <>
                                        <FormItem className="flex flex-row items-start space-x-2 space-y-0 py-3">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    id="terms"
                                                />
                                            </FormControl>
                                            <div className="leading-none">
                                                <FormLabel htmlFor="terms">
                                                    Accept terms and conditions
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    </>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
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
