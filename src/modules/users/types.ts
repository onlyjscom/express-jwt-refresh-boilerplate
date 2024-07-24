export interface UserDb {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface User extends Omit<UserDb, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithHashedPassword extends User {
    hashedPassword: string;
}
