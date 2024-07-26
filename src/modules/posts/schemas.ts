import * as z from 'zod';
import { contentSchema, titleSchema } from './validations';
import { idSchema } from '../../utils';

export const postIndexSchema = z.strictObject({
    query: z.strictObject({
            userId: idSchema.optional(),
        },
    ).optional(),
});

export const postShowSchema = z.strictObject({
    params: z.strictObject({
        id: idSchema,
    }),
});

export const postCreateSchema = z.strictObject({
    body: z.strictObject({
        title: titleSchema,
        content: contentSchema,
    }),
});

export const postUpdateSchema = z.strictObject({
    params: z.strictObject({
        id: idSchema,
    }),
    body: z.strictObject({
        title: titleSchema.optional(),
        content: contentSchema.optional(),
    }),
});

export const postDestroySchema = z.strictObject({
    params: z.strictObject({
        id: idSchema,
    }),
});


export type PostCreatePayload = z.infer<typeof postCreateSchema>['body'];
export type PostUpdatePayload = z.infer<typeof postUpdateSchema>['body'];
