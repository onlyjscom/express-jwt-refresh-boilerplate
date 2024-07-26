import * as z from 'zod';

const title = z.string().min(2).max(32);
const content = z.string().min(5).max(1024);

export {
    title as titleValidation,
    content as contentValidation,
};
