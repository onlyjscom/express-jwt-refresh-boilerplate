import { Router } from 'express';
import { UsersController } from './controller';
import { authenticate, requireRole, validateRequest } from '../../middlewares';
import { userDestroyRequestSchema, userIndexRequestSchema, userShowRequestSchema, userUpdateRequestSchema } from './request-schemas';


const app = Router();

app.get('/', [authenticate, requireRole('admin'), validateRequest(userIndexRequestSchema)], UsersController.index);
app.get('/:id', [validateRequest(userShowRequestSchema), authenticate], UsersController.show);
app.put('/:id', [validateRequest(userUpdateRequestSchema), authenticate], UsersController.update);
app.delete('/:id', [validateRequest(userDestroyRequestSchema), authenticate], UsersController.destroy);

export {
    app as UserRouter,
};
