import * as z from 'zod';

const id = z.preprocess((id: string) => +id, z.number().int().positive());

export { id as idValidation };
