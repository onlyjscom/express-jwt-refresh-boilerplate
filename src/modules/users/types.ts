export interface UserDb {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    hashedPassword: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface UserDbWithoutHashedPassword extends Omit<UserDb, 'hashedPassword'> {
}

export interface User extends Omit<UserDbWithoutHashedPassword, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithHashedPassword extends User {
    hashedPassword: string;
}

