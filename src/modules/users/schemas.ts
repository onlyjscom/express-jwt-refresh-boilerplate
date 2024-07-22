import * as z from 'zod';
import { firstNameSchema, lastNameSchema, passwordSchema, roleSchema, usernameSchema } from './validations';

export const userUpdateSchema = z.object({
    body: z.object({
        username: usernameSchema.optional(),
        password: passwordSchema.optional(),
        firstName: firstNameSchema.optional(),
        lastName: lastNameSchema.optional(),
        role: roleSchema.optional(),
    }),
});

export type UserUpdatePayload = z.infer<typeof userUpdateSchema>['body'];
