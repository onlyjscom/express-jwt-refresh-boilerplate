import * as z from 'zod';

const username = z.string().min(4).max(16);
const password = z.string().min(8).max(32);
const firstName = z.string().min(2).max(32);
const lastName = z.string().min(2).max(32);
const role = z.enum(['user', 'admin']).optional().default('user');

export {
    username as usernameSchema,
    password as passwordSchema,
    firstName as firstNameSchema,
    lastName as lastNameSchema,
    role as roleSchema,
};
