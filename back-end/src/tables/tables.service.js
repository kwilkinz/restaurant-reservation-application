const knex = require("../db/connection");

// LIST
const list = () => {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc")
};

// CREATE
const create = (newTable) => {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((created) => created[0])
}


// READ
const read = (table_id) => {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first()
}


// UPDATE
const update = (updatedTable) => {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updated) => updated[0])
}


module.exports = {
    list, 
    create, 
    read, 
    update,
}
