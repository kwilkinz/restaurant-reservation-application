exports.up = function (knex) {
  return knex.schema.createTable("table", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity");
    table.integer("reservation_id").defaultTo(null);
    table
      .foreign("reservation_id")
      .references("reservation_id")
      .inTable("reservations");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("table");
};
