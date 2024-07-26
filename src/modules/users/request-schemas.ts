import * as z from 'zod';
import { firstNameValidation, lastNameValidation, passwordValidation, roleValidation, usernameValidation } from './field-validations';
import { idValidation } from '../../utils';

export const userIndexRequestSchema = z.strictObject({
    query: z.strictObject({
        role: roleValidation.optional(),
    }).optional(),
});

export const userShowRequestSchema = z.strictObject({
    params: z.strictObject({
        id: idValidation,
    }),
});

export const userUpdateRequestSchema = z.strictObject({
    params: z.strictObject({
        id: idValidation,
    }),
    body: z.strictObject({
        username: usernameValidation.optional(),
        password: passwordValidation.optional(),
        firstName: firstNameValidation.optional(),
        lastName: lastNameValidation.optional(),
        role: roleValidation.optional(),
    }),
});

export const userDestroyRequestSchema = userShowRequestSchema;


export type UserUpdatePayload = z.infer<typeof userUpdateRequestSchema>['body'];
