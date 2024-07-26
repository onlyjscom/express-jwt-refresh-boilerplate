import * as z from 'zod';

const username = z.string().min(4).max(16);
const password = z.string().min(8).max(32);
const firstName = z.string().min(2).max(32);
const lastName = z.string().min(2).max(32);
const role = z.enum(['user', 'admin']).default('user');

export {
    username as usernameValidation,
    password as passwordValidation,
    firstName as firstNameValidation,
    lastName as lastNameValidation,
    role as roleValidation,
};
