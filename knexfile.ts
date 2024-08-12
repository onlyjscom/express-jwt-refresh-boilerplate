import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'better-sqlite3',
        connection: {
            filename: './db.sqlite',
        },
        useNullAsDefault: true,
        migrations: {
            directory: './src/database/migrations',
        },
    },
};

export default config;
