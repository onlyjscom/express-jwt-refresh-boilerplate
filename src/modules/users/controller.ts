import { NextFunction, Request, Response } from 'express';
import { UsersService } from './service';
import { ForbiddenException, NotFoundException } from '../../utils';
import { User } from './types';


export class UsersController {
    static async index(req: Request, res: Response, next: NextFunction) {
        const role = req.query.role as User['role'];

        const users = await UsersService.index({ role });

        res.json(users);
    }

    static async show(req: Request, res: Response, next: NextFunction) {
        const id = +req.params.id;

        const user = await UsersService.show(id);

        res.json(user);
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        checkIfAllowedToModify(req);

        const id = +req.params.id;

        const payload = req.body;
        const lang = req.acceptsLanguages()[0].replace('*', '') || 'en';

        const user = await UsersService.update(id, payload, lang);

        res.json(user);
    }

    static async destroy(req: Request, res: Response, next: NextFunction) {
        checkIfAllowedToModify(req);

        const id = +req.params.id;

        const isDeleted = await UsersService.destroy(id);

        if (!isDeleted) {
            throw new NotFoundException('User not found');
        }

        res.json({ message: 'User deleted' });
    }
}


function checkIfAllowedToModify(req: Request) {
    const allowed = req.user!.role === 'admin' || req.user!.id === +req.params.id;

    // In a real project, you must also check if the user is trying to update their role to 'admin'
    // and throw a ForbiddenException if they are not allowed to do so

    if (!allowed) {
        throw new ForbiddenException();
    }
}
