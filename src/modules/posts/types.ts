export interface PostDb {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: null | string;
}

export interface Post extends Omit<PostDb, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt: null | Date;
}
