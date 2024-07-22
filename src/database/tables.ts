import { db } from './instance';

const Users = () => db('users');
const RefreshTokens = () => db('refreshTokens');
const Posts = () => db('posts');

export {
    Users,
    RefreshTokens,
    Posts,
};
