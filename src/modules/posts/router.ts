import { Router } from 'express';
import { authenticate, validateRequest } from '../../middlewares';
import { PostsController } from './controller';
import { postCreateSchema, postUpdateSchema } from './schemas';

const app = Router();

app.get('/', PostsController.index);
app.post('/', [validateRequest(postCreateSchema), authenticate], PostsController.store);
app.get('/:id', PostsController.show);
app.put('/:id', [validateRequest(postUpdateSchema), authenticate], PostsController.update);
app.delete('/:id', authenticate, PostsController.destroy);

export {
    app as PostsRouter,
};
