import { Request, Response, Router } from 'express';
import nodemailer from 'nodemailer';

export const resetPassword = Router();

resetPassword.post('/', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) return res.sendStatus(401);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const emailResponse = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset password',
            text: 'Hello world?',
            html: '<b>Hello world?</b>',
        });

        console.log('Message sent:', emailResponse);
        return res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});
