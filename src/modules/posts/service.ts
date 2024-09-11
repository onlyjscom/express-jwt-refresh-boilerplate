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
        const postRaw = await Posts().where({ id }).first();

        if (!postRaw) {
            throw new NotFoundException('Post not found');
        }

        const post = parsePost(postRaw);

        return post;
    }

    async store(payload: PostCreatePayload & { userId: number }) {
        const postRaw = (await Posts().insert(payload).returning<PostDb>('*'))[0] as PostDb;
        const post = parsePost(postRaw);

        return post!;
    }

    async update(id: number, payload: PostUpdatePayload) {
        await Posts().where({ id }).update({ ...payload, updatedAt: formatSqliteDate(new Date()) });

        const updatedPostRaw = await Posts().where({ id }).first();


        if (!updatedPostRaw) {
            throw new NotFoundException('Post not found');
        }

        const updatedPost = parsePost(updatedPostRaw);

        return updatedPost;
    }

    async destroy(id: number) {
        const deletedPostsCount = await Posts().where({ id }).delete();

        return deletedPostsCount === 1;
    }
}

const service = new PostsService();

export { service as PostsService };
