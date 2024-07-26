import * as z from 'zod';
import {
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    roleValidation,
    usernameValidation,
} from '../users/field-validations';

export const userRegistrationRequestSchema = z.strictObject({
    body: z.strictObject({
        username: usernameValidation,
        password: passwordValidation,
        firstName: firstNameValidation,
        lastName: lastNameValidation,
        role: roleValidation.optional(), // You probably want to remove this line in a real project and set the role in the backend
    }),
});

export const userLoginRequestSchema = z.strictObject({
    body: z.strictObject({
        username: usernameValidation,
        password: passwordValidation,
    }),
});


export type UserRegistrationPayload = z.infer<typeof userRegistrationRequestSchema>['body'];
