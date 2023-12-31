import { Router } from 'express';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { db } from '@/database/prismaClient.js';
import { verifyJWT } from '@/middleware/verifyJWT.js';
import { verifyRole } from '@/middleware/verifyRoles.js';
export const post = Router();

post.use(verifyJWT);

post.post('/', verifyRole(['admin', 'editor', 'user']), async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;
    try {
        const newPost = await db.post.create({
            data: {
                title: title,
                content: content,
                authorId: userId,
            },
        });
        res.status(201).json({ post: newPost });
    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return res.sendStatus(409); // Conflict
        }

        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});

post.get('/', verifyRole(['admin', 'editor', 'user']), async (req, res) => {
    try {
        const userId = req.userId;

        const posts = await db.post.findMany({
            where: {
                authorId: userId,
            },
        });
        res.status(200).json({ posts });
    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2015'
        ) {
            return res.sendStatus(404); // Not found
        }

        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});

post.get('/:id', verifyRole(['admin', 'editor', 'user']), async (req, res) => {
    try {
        const userId = req.userId;

        const post = await db.post.findUniqueOrThrow({
            where: {
                id: Number(req.params.id),
            },
        });

        if (post.authorId !== userId) {
            return res.sendStatus(401);
        }

        res.status(200).json({ post });
    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2015'
        ) {
            return res.sendStatus(404); // Not found
        }

        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});

post.patch(
    '/:id',
    verifyRole(['admin', 'editor', 'user']),
    async (req, res) => {
        try {
            const userId = req.userId;
            const { title, content } = req.body;

            const post = await db.post.findUniqueOrThrow({
                where: {
                    id: Number(req.params.id),
                },
            });

            if (post.authorId !== userId) {
                return res.sendStatus(401);
            }

            const updatedPost = await db.post.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    title: title,
                    content: content,
                },
            });

            res.status(200).json({ updatedPost });
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === '2025'
            ) {
                return res.sendStatus(404); // Not found
            }

            if (error instanceof Error) {
                console.log(error.message);
                return res.sendStatus(500);
            }
        }
    }
);
