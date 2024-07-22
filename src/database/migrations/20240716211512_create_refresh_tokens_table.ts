import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('refreshTokens', function(table) {
        table.increments();
        table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
        table.datetime('revokedAt').defaultTo(null);
        table.datetime('expiresAt').notNullable();
        table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').defaultTo(null);
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('refreshTokens');
}
