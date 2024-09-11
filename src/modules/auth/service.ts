import jwt from 'jsonwebtoken';
import * as argon2 from '@node-rs/argon2';
import * as process from 'process';
import { convertToSeconds, formatSqliteDate, NotFoundException, UnprocessableEntityException } from '../../utils';
import { parseRefreshToken, parseUser, RefreshTokens, Users } from '../../database';
import { RefreshTokenDb, RtPayload } from './types';
import { returningUserFields, User, UserDb } from '../users';


export const JWT_SECRET_AT = process.env.JWT_SECRET_AT!;
export const JWT_SECRET_RT = process.env.JWT_SECRET_RT!;

const allTokenSettings = {
    accessToken: {
        expiresIn: 300, // 5 minutes
        secret: JWT_SECRET_AT,
    },
    refreshToken: {
        expiresIn: 86400, // 1 day
        secret: JWT_SECRET_RT,
    },
};

class AuthService {

    async findUserFromCredentials(username: string, password: string): Promise<User> {
        const userRaw: UserDb | undefined = await Users().where({ username }).select<UserDb>([...returningUserFields, 'hashedPassword']).first();

        if (!userRaw) {
            throw new NotFoundException('User not found');
        }

        const passwordMatch = await this.verifyPassword(userRaw.hashedPassword, password);

        if (!passwordMatch) {
            throw new NotFoundException('User not found');
        }

        const user = parseUser(userRaw);

        return user;
    }

    async generateAuthTokens(user: User, oldRtPayload?: RtPayload): Promise<{
        accessToken: string,
        refreshToken: string
    }> {
        const now = new Date();

        const accessToken = await this.generateAuthToken(user, 'accessToken', now);
        const refreshToken = await this.generateAuthToken(user, 'refreshToken', now, oldRtPayload);

        return { accessToken, refreshToken };
    }

    async revokeRefreshToken(jti: number) {
        const refreshTokenDb: RefreshTokenDb | undefined = await RefreshTokens().where({ id: jti }).first();

        if (!refreshTokenDb) {
            throw new NotFoundException('Refresh token not found');
        }

        const refreshToken = parseRefreshToken(refreshTokenDb);


        if (refreshToken.revokedAt) {
            throw new UnprocessableEntityException('Refresh token already revoked');
        }

        await RefreshTokens().where({ id: jti }).update({ revokedAt: formatSqliteDate(new Date()) });

        return true;
    }

    async revokeAllRefreshTokensOfUser(userId: number) {
        const revokedTokensCount = await RefreshTokens().where({
            userId,
            revokedAt: null,
        }).update({
            revokedAt: formatSqliteDate(new Date()),
        });

        return revokedTokensCount;
    }

    private verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }

    private async generateAuthToken(user: User, type: 'accessToken' | 'refreshToken', iat: Date, oldRtPayload?: RtPayload) {
        let jti: number | undefined;

        const iatDate = new Date(iat);
        iatDate.setMilliseconds(0);


        const tokenSettings = allTokenSettings[type];

        const tokenExpiresIn = tokenSettings.expiresIn;
        const tokenExpiresAt = new Date(iatDate);
        tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokenExpiresIn, 0);


        if (type === 'refreshToken') {
            jti = await this.upsertRefreshToken({
                userId: user.id,
                issuedAt: iatDate,
                tokenExpiresAt,
                oldRtPayload,
            });
        }

        // We generate iat (issued at) and exp (expiration) manually because of better precision
        const iatAsSeconds = convertToSeconds(iatDate);
        const exp = convertToSeconds(tokenExpiresAt);

        const secret = tokenSettings.secret;

        // You can add more data to the token if you want but make sure to add it also to the AtPayload and RtPayload types
        const token = jwt.sign({
            sub: user.id,
            jti,
            iat: iatAsSeconds,
            exp,
        }, secret);

        return token;
    }

    private async upsertRefreshToken(
        { userId, issuedAt, tokenExpiresAt, oldRtPayload }: {
            userId: number,
            issuedAt: Date,
            tokenExpiresAt: Date,
            oldRtPayload: RtPayload | undefined,
        }) {
        let jti = oldRtPayload?.jti;
        const tokenExpiresAtString = formatSqliteDate(tokenExpiresAt);
        const iatString = formatSqliteDate(issuedAt);

        if (!oldRtPayload) {
            // We need to store the jti of the refresh token in the database
            const refreshTokenDb: RefreshTokenDb = (await RefreshTokens().insert({
                userId,
                expiresAt: tokenExpiresAtString,
                createdAt: iatString, // These dates need to be equal to "iat" of signed token. That's why we manually set them here
                updatedAt: iatString, // We will validate refresh token freshness based on these dates when refresh is requested
            }).returning<RefreshTokenDb>(['id']))[0] as RefreshTokenDb;
            jti = refreshTokenDb.id;
        } else {
            const refreshTokenDb = await RefreshTokens().where({ id: jti }).first();

            if (!refreshTokenDb) {
                throw new NotFoundException('Invalid refresh token');
            }

            const refreshToken = parseRefreshToken(refreshTokenDb);

            if (!refreshToken) {
                throw new NotFoundException('Refresh token not found');
            }

            if (refreshToken.revokedAt) {
                throw new UnprocessableEntityException('Refresh token revoked');
            }

            if (refreshToken.expiresAt < new Date()) {
                throw new UnprocessableEntityException('Refresh token expired');
            }

            const refreshTokenDbIssuedAt = refreshToken.updatedAt;

            const oldRefreshTokenIssuedAt = new Date(0);
            oldRefreshTokenIssuedAt.setUTCSeconds(oldRtPayload.iat);


            // We need to check if these dates are equal because we need to make sure that the refresh token is not used
            // after it was updated in the database
            if (refreshTokenDbIssuedAt.getTime() !== oldRefreshTokenIssuedAt.getTime()) {
                throw new UnprocessableEntityException('Refresh token already consumed');
            }

            // We need to update the expiration date of the refresh token in the database
            await RefreshTokens().where({ id: jti }).update({
                expiresAt: tokenExpiresAtString,
                updatedAt: iatString,
            });
        }

        return jti!;
    }
}

const service = new AuthService();
export { service as AuthService };
