import { db } from '@/database/prismaClient.js';
import { Request, Response, Router } from 'express';
import { Resend } from 'resend';
import bcrypt from 'bcrypt';

const resend = new Resend(process.env.RESEND_API_KEY);

export const resetPassword = Router();

resetPassword.post('/', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) return res.sendStatus(401);

    try {
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) return res.sendStatus(404);

        const token = await db.passwordResetToken.create({
            data: {
                userId: user.id,
            },
        });

        const url = `http://localhost:3000/reset-password/${token.id}`;

        await resend.emails.send({
            from: `${process.env.MAIL_USER} <${process.env.MAIL_ADRESS}>`,
            to: email,
            subject: 'Reset password',
            html: `<a href=${url}>Click to reset your password</a>`,
        });

        return res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
        return res.sendStatus(500);
    }
});

resetPassword.post('/:tokenId', async (req: Request, res: Response) => {
    const { tokenId } = req.params;
    const { password } = req.body;

    if (!tokenId || !password) return res.sendStatus(401);

    try {
        const token = await db.passwordResetToken.findUnique({
            where: { id: tokenId },
        });

        if (!token) return res.sendStatus(404);

        const user = await db.user.findUnique({
            where: { id: token.userId },
        });

        if (!user) return res.sendStatus(404);

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            },
        });

        await db.passwordResetToken.delete({
            where: { id: tokenId },
        });

        return res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
        res.sendStatus(500);
    }
});
