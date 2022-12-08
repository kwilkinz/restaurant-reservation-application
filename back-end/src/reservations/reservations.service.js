const knex = require("../db/connection");

//LIST By Date
const listByDate = (reservation_date) => {
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNot({ status: "finished" })
        .whereNot({ status: "cancelled" })
        .orderBy("reservation_time")
};

// list by number 
const listByNumber = (mobile_number) => {
    return knex("reservations")
        .whereRaw("translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

// READ 
const read = (reservation_id) => {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first()
};

// CREATE
const create = (reservation) => {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((created) => created[0])
};

// UPDATE
const update = (reservation) => {
    return knex("reservations")
        .where({ reservation_id: reservation.reservation_id })
        .update(reservation, "*")
        .then((updated) => updated[0])
};

// UPDATE STATUS 
const updateStatus = (reservation_id, status) => {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status }, "*")
        .then((updated) => updated[0])
};


// SEARCH 
const search = (knex, mobile_number) => {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  };


module.exports = {
    listByDate,
    listByNumber, 
    read,
    create,
    update,
    updateStatus,
    search,
};