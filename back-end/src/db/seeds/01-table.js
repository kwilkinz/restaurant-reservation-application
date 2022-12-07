const table = require("../importseeds/01-table")

exports.seed = function (knex) {
    return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("table").insert(table);
    });
}