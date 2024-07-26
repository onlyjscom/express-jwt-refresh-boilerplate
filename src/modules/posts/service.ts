import { parsePost, Posts } from '../../database';
import { PostCreatePayload, PostUpdatePayload } from './request-schemas';
import { formatSqliteDate, NotFoundException } from '../../utils';
import { PostDb } from './types';

class PostsService {
    async index({ userId }: { userId?: number } = {}) {
        let postsQuery = Posts();

        if (userId) {
            postsQuery = postsQuery.where({ userId });
        }

        const postsRaw: PostDb[] = await postsQuery;

        const posts = postsRaw.map(postRaw => parsePost(postRaw)!);

        return posts;
    }

    async show(id: number) {
        const postRaw: PostDb = await Posts().where({ id }).first();
        const post = parsePost(postRaw);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async store(payload: PostCreatePayload & { userId: number }) {
        const [postRaw]: [PostDb] = await Posts().insert(payload).returning('*');
        const post = parsePost(postRaw);

        return post!;
    }

    async update(id: number, payload: PostUpdatePayload) {
        await Posts().where({ id }).update({ ...payload, updatedAt: formatSqliteDate(new Date()) });

        const updatedPostRaw: PostDb = await Posts().where({ id }).first();
        const updatedPost = parsePost(updatedPostRaw);

        if (!updatedPost) {
            throw new NotFoundException('Post not found');
        }

        return updatedPost;
    }

    async destroy(id: number) {
        const deletedPostsCount = await Posts().where({ id }).delete();

        return deletedPostsCount === 1;
    }
}

const service = new PostsService();

export { service as PostsService };
