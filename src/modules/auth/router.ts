import './passport';
import { Router } from 'express';
import { authenticate, authMiddlewares, validateRequest } from '../../middlewares';
import { AuthController } from './controller';
import { userLoginRequestSchema, userRegistrationRequestSchema } from './request-schemas';

const app = Router();

app.post('/register', validateRequest(userRegistrationRequestSchema), AuthController.register);
app.post('/login', [validateRequest(userLoginRequestSchema), authMiddlewares['local']], AuthController.login);
app.get('/me', authenticate, AuthController.me);
app.post('/refresh', authMiddlewares['jwt-refresh'], AuthController.refresh);
app.post('/logout', authMiddlewares['jwt-refresh'], AuthController.logout);
app.post('/logout-all', authMiddlewares['jwt-refresh'], AuthController.logoutAll);

export {
    app as AuthRouter,
};
