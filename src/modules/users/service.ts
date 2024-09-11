import * as argon2 from '@node-rs/argon2';
import { parseUser, Users } from '../../database';
import { UserUpdatePayload } from './request-schemas';
import { capitalize, formatSqliteDate, NotFoundException } from '../../utils';
import { UserDb, UserDbWithoutHashedPassword } from './types';
import { UserRegistrationPayload } from '../auth/request-schemas';

export const returningUserFields = ['id', 'username', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'];

class UsersService {
    async index({ role }: { role?: 'user' | 'admin' } = {}) {
        let query = Users().select<UserDbWithoutHashedPassword[]>(returningUserFields);

        if (role) {
            query = query.where({ role });
        }

        const usersRaw: UserDbWithoutHashedPassword[] = await query;
        const users = usersRaw.map(userRaw => parseUser(userRaw));

        return users;
    }

    async show(id: number) {
        const userRaw = await Users().where({ id }).select<UserDbWithoutHashedPassword>(returningUserFields).first();

        if (!userRaw) {
            throw new NotFoundException('User not found');
        }

        const user = parseUser(userRaw);


        return user;
    }

    async store(payloadRaw: UserRegistrationPayload, lang?: string) {
        const payload = await this.prepareUserPayload({ ...payloadRaw, role: payloadRaw.role ?? 'user' }, lang);

        const userRaw = (await Users().insert(payload as UserDb).returning<UserDbWithoutHashedPassword>(returningUserFields))[0] as UserDbWithoutHashedPassword;
        const user = parseUser(userRaw);

        return user;
    }

    async update(id: number, payloadRaw: UserUpdatePayload, lang?: string) {
        const payload = await this.prepareUserPayload(payloadRaw, lang);

        await Users().where({ id }).update({ ...payload, updatedAt: formatSqliteDate(new Date()) });

        const updatedUserRaw = await Users().where({ id }).select<UserDbWithoutHashedPassword>(returningUserFields).first();

        if (!updatedUserRaw) {
            throw new NotFoundException('User not found');
        }

        const updatedUser = parseUser(updatedUserRaw);

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

        Object.keys(userPayload).forEach((key) => {
            const _key = key as keyof typeof userPayload;
            if (userPayload[_key] == null) {
                delete userPayload[_key];
            }
        });

        return userPayload;
    }
}

const service = new UsersService();

export { service as UsersService };
