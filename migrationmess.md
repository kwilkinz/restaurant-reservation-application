ReservationsTable

exports.up = function (knex) {
return knex.schema.createTable("reservations", (table) => {
table.increments("reservation_id").primary();
table.string("first_name").notNullable();
table.string("last_name").notNullable();
table.string("mobile_number").notNullable();
table.date("reservation_date").notNullable();
table.time("reservation_time").notNullable();
table.integer("people").notNullable();
table.timestamps(true, true);
});
};

exports.down = function (knex) {
return knex.schema.dropTable("reservations");
};

TablesTable
exports.up = function (knex) {
return knex.schema.createTable("tables", (table) => {
table.increments("table_id").primary();
table.string("table_name").notNullable();
table.integer("capacity").notNullable();
table.integer("reservation_id").defaultTo(null);
table
.foreign("reservation_id")
.references("reservation_id")
.inTable("reservations");
});
};

exports.down = function (knex) {
return knex.schema.dropTable("tables");
};

addReservationStatus
exports.up = function (knex) {
return knex.schema.table("reservations", (table) => {
table.string("status").notNullable().defaultTo("booked");
});
};

exports.down = function (knex) {
return knex.schema.table("reservations", (table) => {
table.dropColumn("status");
});
};
