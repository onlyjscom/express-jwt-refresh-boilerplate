import { Router } from 'express';
import { authenticate, validateRequest } from '../../middlewares';
import { PostsController } from './controller';
import { postCreateSchema, postDestroySchema, postIndexSchema, postShowSchema, postUpdateSchema } from './schemas';

const app = Router();

app.get('/', validateRequest(postIndexSchema), PostsController.index);
app.post('/', [validateRequest(postCreateSchema), authenticate], PostsController.store);
app.get('/:id', validateRequest(postShowSchema), PostsController.show);
app.put('/:id', [validateRequest(postUpdateSchema), authenticate], PostsController.update);
app.delete('/:id', [validateRequest(postDestroySchema), authenticate], PostsController.destroy);

export {
    app as PostsRouter,
};
