/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('requests', function (table) {
        table.increments();

        table.string('patient').notNullable();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.boolean('pending').notNullable().defaultTo(true);
        table.boolean('accepted').defaultTo(null);


        table.string('key').notNullable();
        table.string('salt').notNullable();
        table.boolean('readAnswer').notNullable().defaultTo(false);
        table.string('token').defaultTo(null);

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('requests');
};
