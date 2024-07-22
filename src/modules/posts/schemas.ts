import * as z from 'zod';
import { contentSchema, titleSchema } from './validations';

export const postCreateSchema = z.object({
    body: z.object({
        title: titleSchema,
        content: contentSchema,
    }),
});

export type PostCreatePayload = z.infer<typeof postCreateSchema>['body'] & { userId: number };


export const postUpdateSchema = z.object({
    body: z.object({
        title: titleSchema.optional(),
        content: contentSchema.optional(),
    }),
});

export type PostUpdatePayload = z.infer<typeof postUpdateSchema>['body'];
