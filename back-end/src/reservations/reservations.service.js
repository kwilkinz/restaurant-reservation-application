// const knex = require("../db/connection");

//LIST 
const list = (knex) => {
    return knex("reservations")
        .select("*");
};


// READ 
const read = (knex, reservationId) => {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
};

// CREATE
const create = (knex, reservation) => {
    return knex("reservations")
        .insert(reservation)
        .returning("*");
};

// UPDATE
const update = (knex, reservationId, updatedReservation) => {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .update(updatedReservation, "*");
};

// LISTBYDATE
const listByDate = (knex, date) => {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "Finished" })
        .whereNot({ status: "Cancelled" })
        .orderBy("reservation_time", "asc");
}

// SEARCH 
const search = (knex, mobile_number) => {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  };


// DESTROY
const destroy = (knex, reservationId) => {
    return knex("reservations")
        .where({ reservation_id: reservationId })
        .del();
};

module.exports = {
    list, 
    read,
    create,
    update,
    listByDate,
    search,
    destroy,
};