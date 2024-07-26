import * as z from 'zod';
import { firstNameSchema, lastNameSchema, passwordSchema, roleSchema, usernameSchema } from '../users/validations';

export const userRegistrationSchema = z.strictObject({
    body: z.strictObject({
        username: usernameSchema,
        password: passwordSchema,
        firstName: firstNameSchema,
        lastName: lastNameSchema,
        role: roleSchema.optional(), // You probably want to remove this line in a real project and set the role in the backend
    }),
});

export const userLoginSchema = z.strictObject({
    body: z.strictObject({
        username: usernameSchema,
        password: passwordSchema,
    }),
});


export type UserRegistrationPayload = z.infer<typeof userRegistrationSchema>['body'];
