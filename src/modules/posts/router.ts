import { Router } from 'express';
import { authenticate, validateRequest } from '../../middlewares';
import { PostsController } from './controller';
import { postCreationRequestSchema, postDestroyRequestSchema, postIndexRequestSchema, postShowRequestSchema, postUpdateRequestSchema } from './request-schemas';

const app = Router();

app.get('/', validateRequest(postIndexRequestSchema), PostsController.index);
app.post('/', [validateRequest(postCreationRequestSchema), authenticate], PostsController.store);
app.get('/:id', validateRequest(postShowRequestSchema), PostsController.show);
app.put('/:id', [validateRequest(postUpdateRequestSchema), authenticate], PostsController.update);
app.delete('/:id', [validateRequest(postDestroyRequestSchema), authenticate], PostsController.destroy);

export {
    app as PostsRouter,
};
