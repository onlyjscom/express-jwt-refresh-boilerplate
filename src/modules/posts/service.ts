import { parsePost, Posts } from '../../database';
import { PostCreatePayload, PostUpdatePayload } from './schemas';
import { formatSqliteDate, NotFoundException } from '../../utils';
import { PostDb } from './types';

class PostsService {
    async index() {
        const postsRaw: PostDb[] = await Posts();
        const posts = postsRaw.map(postRaw => parsePost(postRaw)!);

        return posts;
    }

    async show(id: number) {
        const postRaw: PostDb = await Posts().where({ id }).select().first();
        const post = parsePost(postRaw);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    async store(payload: PostCreatePayload) {
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
