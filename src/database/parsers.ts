import { RefreshToken, RefreshTokenDb } from '../modules/auth';
import { parseSqliteDate } from '../utils';
import { User, UserDb } from '../modules/users';
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
): ReturnType | null {
    if (!row) return null;

    const parsedRow = { ...row };

    dateFields.forEach((field) => {
        if (parsedRow[field]) {
            parsedRow[field] = parseSqliteDate(parsedRow[field]) as any;
        }
    });

    return parsedRow as ReturnType;
}

// Example usage with RefreshTokenDb and UserDb
export function parseRefreshToken(refreshToken: RefreshTokenDb) {
    const dateFields = ['revokedAt', 'expiresAt', 'createdAt', 'updatedAt'] as const;

    return parseRow<RefreshToken>(refreshToken, dateFields);
}

export function parseUser(user: UserDb) {
    const dateFields = ['createdAt', 'updatedAt'] as const;

    return parseRow<User>(user, dateFields);
}

export function parsePost(post: PostDb) {
    const dateFields = ['createdAt', 'updatedAt'] as const;

    return parseRow<Post>(post, dateFields);
}
