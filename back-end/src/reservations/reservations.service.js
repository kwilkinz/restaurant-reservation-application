const knex = require("../db/connection");

//LIST By Date
async function listByDate(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNot({ status: "finished" })
        .whereNot({ status: "cancelled" })
        .orderBy("reservation_time")
};

// list by number 
async function listByNumber(mobile_number) {
    return knex("reservations")
        .whereRaw("translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

// READ 
async function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first()
};

// CREATE
async function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((created) => created[0])
};

// UPDATE
async function update(reservation) {
    return knex("reservations")
        .where({ reservation_id: reservation.reservation_id })
        .update(reservation, "*")
        .then((updated) => updated[0])
};

// UPDATE STATUS 
async function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status }, "*")
        .then((updated) => updated[0])
};


// SEARCH 
async function search(knex, mobile_number) {
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