import * as z from 'zod';
import { firstNameSchema, lastNameSchema, passwordSchema, roleSchema, usernameSchema } from './validations';
import { idSchema } from '../../utils';

export const userIndexSchema = z.strictObject({
    query: z.strictObject({
        role: roleSchema.optional(),
    }).optional(),
});

export const userShowSchema = z.strictObject({
    params: z.strictObject({
        id: idSchema,
    }),
});

export const userUpdateSchema = z.strictObject({
    params: z.strictObject({
        id: idSchema,
    }),
    body: z.strictObject({
        username: usernameSchema.optional(),
        password: passwordSchema.optional(),
        firstName: firstNameSchema.optional(),
        lastName: lastNameSchema.optional(),
        role: roleSchema.optional(),
    }),
});

export const userDestroySchema = userShowSchema;


export type UserUpdatePayload = z.infer<typeof userUpdateSchema>['body'];
