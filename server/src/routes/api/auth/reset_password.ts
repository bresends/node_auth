import { db } from '@src/database/drizzleClient.js';
import { Request, Response, Router } from 'express';
import { Resend } from 'resend';
import bcrypt from 'bcrypt';
import { users, passwordResetToken } from '@src/database/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '@/env';

const resend = new Resend(env.RESEND_API_KEY);

export const resetPassword = Router();

resetPassword.post('/', async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) return res.sendStatus(401);

    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user.length) return res.sendStatus(404);

        const token = await db
            .insert(passwordResetToken)
            .values({
                userId: user[0].id,
            })
            .returning({ id: passwordResetToken.id });

        const url = `${env.CLIENT_URL}/reset-password/${token[0].id}`;

        await resend.emails.send({
            from: `${env.MAIL_USER} <${env.MAIL_ADRESS}>`,
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
        const token = await db
            .select({ userId: passwordResetToken.userId })
            .from(passwordResetToken)
            .where(eq(passwordResetToken.id, tokenId))
            .limit(1);

        if (!token.length) return res.sendStatus(404);

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, Number(token[0].userId)));

        if (!user.length) return res.sendStatus(404);

        const hashedPassword = await bcrypt.hash(password, 10);

        await db
            .update(users)
            .set({
                password: hashedPassword,
            })
            .where(eq(users.id, user[0].id));

        await db
            .delete(passwordResetToken)
            .where(eq(passwordResetToken.id, tokenId));

        return res.sendStatus(200);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
        res.sendStatus(500);
    }
});
