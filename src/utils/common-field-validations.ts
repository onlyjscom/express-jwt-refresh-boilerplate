import * as z from 'zod';

const id = z.preprocess((id) => Number(id), z.number().int().positive());

export { id as idValidation };
