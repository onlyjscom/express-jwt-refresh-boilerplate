export interface UserDb {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: null | string;
}

export interface User extends Omit<UserDb, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt: null | Date;
}

export interface UserWithHashedPassword extends User {
    hashedPassword: string;
}
