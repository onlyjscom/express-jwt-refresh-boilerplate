import * as z from 'zod';
import {
    firstNameValidation,
    lastNameValidation,
    passwordValidation,
    usernameValidation,
} from '../users/field-validations';

export const userRegistrationRequestSchema = z.strictObject({
    body: z.strictObject({
        username: usernameValidation,
        password: passwordValidation,
        firstName: firstNameValidation,
        lastName: lastNameValidation,
    }),
});

export const userLoginRequestSchema = z.strictObject({
    body: z.strictObject({
        username: usernameValidation,
        password: passwordValidation,
    }),
});


export type UserRegistrationPayload = z.infer<typeof userRegistrationRequestSchema>['body'];
