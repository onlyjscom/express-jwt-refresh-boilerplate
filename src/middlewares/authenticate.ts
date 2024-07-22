import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { User } from '../modules/users';


const passportCallback = (req: Request, res: Response, next: NextFunction, unauthorizedMessage = 'Unauthorized') => (err: Error, user: User | null) => {
    // If an error was returned by the strategy, send it to the client
    if (err) {
        // return res.status(500).json({ message: err.message });
        return res.status(500).json({ message: 'Internal server error' });
    }

    // If the user was not found, send an error to the client
    if (!user) {
        return res.status(401).json({ message: unauthorizedMessage });
    }

    // Manually setting the logged-in user to req.user
    // Optionally, you can set it to "req.session" if you're using some sort of session
    req.user = user;

    // Invoking "next" to continue to the controller
    next();
};

const local = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // If email or password is missing, send an error back to the client
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const unauthorizedMessage = 'Incorrect username or password';

    passport.authenticate('local', passportCallback(req, res, next, unauthorizedMessage))(req, res, next);
};

const jwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', passportCallback(req, res, next))(req, res, next);
};

const jwtRefresh = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt-refresh', passportCallback(req, res, next))(req, res, next);
};

export const authMiddlewares = {
    local,
    jwt,
    'jwt-refresh': jwtRefresh,
};
export const authenticate = authMiddlewares.jwt; // alias
