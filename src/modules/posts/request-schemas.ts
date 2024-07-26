import * as z from 'zod';
import { contentValidation, titleValidation } from './field-validations';
import { idValidation } from '../../utils';

export const postIndexRequestSchema = z.strictObject({
    query: z.strictObject({
            userId: idValidation.optional(),
        },
    ).optional(),
});

export const postShowRequestSchema = z.strictObject({
    params: z.strictObject({
        id: idValidation,
    }),
});

export const postCreationRequestSchema = z.strictObject({
    body: z.strictObject({
        title: titleValidation,
        content: contentValidation,
    }),
});

export const postUpdateRequestSchema = z.strictObject({
    params: z.strictObject({
        id: idValidation,
    }),
    body: z.strictObject({
        title: titleValidation.optional(),
        content: contentValidation.optional(),
    }),
});

export const postDestroyRequestSchema = z.strictObject({
    params: z.strictObject({
        id: idValidation,
    }),
});


export type PostCreatePayload = z.infer<typeof postCreationRequestSchema>['body'];
export type PostUpdatePayload = z.infer<typeof postUpdateRequestSchema>['body'];
