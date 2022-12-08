const knex = require("../db/connection");

// LIST
async function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc")
};

// CREATE
async function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((created) => created[0])
};


// READ
async function read (table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first()
};


// UPDATE
async function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updated) => updated[0])
};


module.exports = {
    list, 
    create, 
    read, 
    update,
}
