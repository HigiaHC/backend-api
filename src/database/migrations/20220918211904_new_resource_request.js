/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('resources', function (table) {
        table.increments();

        table.string('patient').notNullable();
        table.string('description').notNullable();
        table.string('type').notNullable();
        table.string('fields').notNullable();
        table.boolean('created').notNullable().defaultTo(false);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('resources');
};
