import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../utils';

type Role = 'user' | 'admin';

export const requireRole = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        next();
    };
};