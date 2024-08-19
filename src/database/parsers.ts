import { RefreshToken, RefreshTokenDb } from '../modules/auth';
import { parseSqliteDate } from '../utils';
import { User, UserDb, UserDbWithoutHashedPassword } from '../modules/users';
import { Post, PostDb } from '../modules/posts';

// Utility type to infer all keys with Date-like values including null and undefined
type DateKey<T> = {
    [K in keyof T]: NonNullable<T[K]> extends Date ? K : never
}[keyof T];

type ExtractDateKeys<T> = DateKey<T>[];

// The parseRow function with inferred dateFields type
function parseRow<ReturnType>(
    row: any,
    dateFields: ExtractDateKeys<ReturnType>,
): ReturnType {
    const parsedRow = { ...row };

    dateFields.forEach((field) => {
        if (parsedRow[field]) {
            parsedRow[field] = parseSqliteDate(parsedRow[field]);
        }
    });

    return parsedRow as ReturnType;
}

// Example usage with RefreshTokenDb and UserDb
export function parseRefreshToken(refreshToken: RefreshTokenDb) {
    const dateFields: DateKey<RefreshToken>[] = ['revokedAt', 'expiresAt', 'createdAt', 'updatedAt'];

    return parseRow<RefreshToken>(refreshToken, dateFields);
}

export function parseUser(user: UserDb | UserDbWithoutHashedPassword) {
    const dateFields: DateKey<User>[] = ['createdAt', 'updatedAt'];

    const parsedUser = parseRow<User>(user, dateFields);

    delete (parsedUser as any).hashedPassword;

    return parsedUser;
}

export function parsePost(post: PostDb) {
    const dateFields: DateKey<Post>[] = ['createdAt', 'updatedAt'];

    return parseRow<Post>(post, dateFields);
}