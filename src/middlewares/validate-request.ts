import { ZodError, ZodSchema } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validateRequest<Schema extends ZodSchema>(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    path: issue.path.join('.'),
                    type: issue.code,
                    message: `${issue.path.at(-1)} is ${issue.message.toLowerCase()}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid data', details: errorMessages });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        }
    };
}
