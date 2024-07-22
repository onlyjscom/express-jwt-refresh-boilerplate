import * as z from 'zod';
import { firstNameSchema, lastNameSchema, passwordSchema, roleSchema, usernameSchema } from '../users/validations';

export const userRegistrationSchema = z.object({
    body: z.object({
        username: usernameSchema,
        password: passwordSchema,
        firstName: firstNameSchema,
        lastName: lastNameSchema,
        role: roleSchema, // You probably want to remove this line in a real project and set the role in the backend
    }),
});

export type UserRegistrationPayload = z.infer<typeof userRegistrationSchema>['body'];

export const userLoginSchema = z.object({
    body: z.object({
        username: usernameSchema,
        password: passwordSchema,
    }),
});