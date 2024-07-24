import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('username', 16).notNullable().unique();
        table.string('firstName', 32).notNullable();
        table.string('lastName', 32).notNullable();
        table.enum('role', ['user', 'admin']).notNullable();
        table.string('hashedPassword').notNullable();
        table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}
