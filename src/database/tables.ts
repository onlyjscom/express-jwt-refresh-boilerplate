import { db } from './instance';
import { UserDb } from '../modules/users';
import { RefreshTokenDb } from '../modules/auth';
import { PostDb } from '../modules/posts';

const Users = () => db<UserDb>('users');
const RefreshTokens = () => db<RefreshTokenDb>('refreshTokens');
const Posts = () => db<PostDb>('posts');

export {
    Users,
    RefreshTokens,
    Posts,
};
