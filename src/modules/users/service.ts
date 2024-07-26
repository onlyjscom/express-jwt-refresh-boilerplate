import * as argon2 from '@node-rs/argon2';
import { parseUser, Users } from '../../database';
import { UserUpdatePayload } from './request-schemas';
import { capitalize, formatSqliteDate, NotFoundException } from '../../utils';
import { UserDb } from './types';
import { UserRegistrationPayload } from '../auth/request-schemas';

export const returningUserFields = ['id', 'username', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'];

class UsersService {
    async index({ role }: { role?: 'user' | 'admin' } = {}) {
        let query = Users().select(returningUserFields);

        if (role) {
            query = query.where({ role });
        }

        const usersRaw: UserDb[] = await query;
        const users = usersRaw.map(userRaw => parseUser(userRaw)!);

        return users;
    }

    async show(id: number) {
        const userRaw: UserDb = await Users().where({ id }).select(returningUserFields).first();
        const user = parseUser(userRaw);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async store(payloadRaw: UserRegistrationPayload, lang?: string) {
        const payload = await this.prepareUserPayload({ ...payloadRaw, role: payloadRaw.role ?? 'user' }, lang);

        const [userRaw]: [UserDb] = await Users().insert(payload).returning(returningUserFields);
        const user = parseUser(userRaw);

        return user!;
    }

    async update(id: number, payloadRaw: UserUpdatePayload, lang?: string) {
        const payload = await this.prepareUserPayload(payloadRaw, lang);

        await Users().where({ id }).update({ ...payload, updatedAt: formatSqliteDate(new Date()) });

        const updatedUserRaw: UserDb = await Users().where({ id }).select(returningUserFields).first();
        const updatedUser = parseUser(updatedUserRaw);

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        return updatedUser;
    }

    async destroy(id: number) {
        const deletedUsersCount = await Users().where({ id }).delete();

        return deletedUsersCount === 1;
    }

    private async prepareUserPayload(payloadRaw: UserUpdatePayload, lang = 'en') {
        const username = (payloadRaw.username as string)?.toLocaleLowerCase(lang);

        const firstName = payloadRaw.firstName ? capitalize(payloadRaw.firstName, lang) : undefined;
        const lastName = payloadRaw.lastName ? capitalize(payloadRaw.lastName, lang) : undefined;

        const role = payloadRaw.role;

        const password = payloadRaw.password;
        const hashedPassword = password ? await argon2.hash(password) : undefined;

        const userPayload = {
            username,
            firstName,
            lastName,
            hashedPassword,
            role,
        };

        Object.keys(userPayload).forEach(key => {
            if (userPayload[key] == null) {
                delete userPayload[key];
            }
        });

        return userPayload;
    }
}

const service = new UsersService();

export { service as UsersService };
