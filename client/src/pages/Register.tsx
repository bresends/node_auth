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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { axios } from '@/lib/axios';

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
            const response = await axios.post(
                '/api/register',
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log(response.data);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    useEffect(() => {
        form.setFocus('email');
    }, [form.setFocus]);

    return (
        <Card className="w-[350px]">
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
                                    <FormLabel htmlFor="email">Email</FormLabel>
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
                                                onCheckedChange={field.onChange}
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
                            Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
