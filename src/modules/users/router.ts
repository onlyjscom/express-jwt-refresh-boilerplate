import { Router } from 'express';
import { UsersController } from './controller';
import { authenticate, validateRequest } from '../../middlewares';
import { userDestroySchema, userIndexSchema, userShowSchema, userUpdateSchema } from './schemas';


const app = Router();

app.get('/', validateRequest(userIndexSchema), UsersController.index);
app.get('/:id', validateRequest(userShowSchema), UsersController.show);
app.put('/:id', [validateRequest(userUpdateSchema), authenticate], UsersController.update);
app.delete('/:id', [validateRequest(userDestroySchema), authenticate], UsersController.destroy);

export {
    app as UserRouter,
};
