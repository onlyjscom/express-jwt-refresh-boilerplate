import { Router } from 'express';
import { UsersController } from './controller';
import { authenticate, validateRequest } from '../../middlewares';
import { userUpdateSchema } from './schemas';


const app = Router();

app.get('/', UsersController.index);
app.get('/:id', UsersController.show);
app.put('/:id', [validateRequest(userUpdateSchema), authenticate], UsersController.update);
app.delete('/:id', authenticate, UsersController.destroy);

export {
    app as UserRouter,
};
