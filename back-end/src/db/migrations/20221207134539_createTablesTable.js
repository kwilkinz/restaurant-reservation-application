
exports.up = function(knex) {
  return knex.schema.createTable("table", (table) => {
      table.increments("table_id").primary();
      table.string("table_name");
      table.integer("capacity");
      table.integer("reservation_id");
      table.string("status").notNullable().defaultTo("Free");
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable("table")
};
