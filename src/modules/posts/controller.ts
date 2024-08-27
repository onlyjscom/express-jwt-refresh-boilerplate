import { NextFunction, Request, Response } from 'express';
import { PostsService } from './service';
import { ForbiddenException, NotFoundException } from '../../utils';
import { User, UsersService } from '../users';
import { Post } from './types';


export class PostsController {
    static async index(req: Request, res: Response, next: NextFunction) {
        const userId = req.query.userId ? +req.query.userId : undefined;

        const posts = await PostsService.index({ userId });

        res.json(posts);
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id;

        const post = await PostsService.show(id);

        res.json(post);
    }

    static async store(req: Request, res: Response, next: NextFunction) {
        const payload = req.body;
        const userId = req.user!.id;

        const post = await PostsService.store({ ...payload, userId });

        res.json(post);
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        const postId = +req.params.id;
        const userId = req.user!.id;

        await checkIfAllowedToModify(userId, postId);

        const payload = req.body;

        const updatedPost = await PostsService.update(postId, payload);

        res.json(updatedPost);
    }

    static async destroy(req: Request, res: Response, next: NextFunction) {
        const postId = +req.params.id;
        const userId = req.user!.id;

        await checkIfAllowedToModify(userId, postId);

        const isDeleted = await PostsService.destroy(postId);

        if (!isDeleted) {
            throw new NotFoundException('Post not found');
        }

        res.json({ message: 'Post deleted' });
    }
}


async function checkIfAllowedToModify(userId: number, postId: number) {
    const [user, post]: [User, Post] = (await Promise.all([UsersService.show(userId), PostsService.show(postId)]));

    const allowed = user.role === 'admin' || user.id === post.userId;

    if (!allowed) {
        throw new ForbiddenException();
    }
}
