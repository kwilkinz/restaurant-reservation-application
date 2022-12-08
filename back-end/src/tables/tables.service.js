// LIST
const list = (knex) => {
    return knex("table")
        .select("*")
        .orderBy("table_name", "asc")
};

// CREATE
const create = (knex, newTable) => {
    return knex("table")
        .insert(newTable)
        .returning("*")
}


// READ
const read = (knex, tableId) => {
    return knex("table")
        .select("*")
        .where({ table_id: tableId })
        .first()
}


// UPDATE
const update = (knex, tableId, updatedTable) => {
    return knex("table")
        .select("*")
        .where({ table_id: tableId })
        .update(updatedTable, "*")
}


// DELETE
const destroy = (knex, reservationId ) => {
    return knex("table")
        .select("*")
        .where({ reservation_id: reservationId })
        .del()
}

module.exports = {
    list, 
    create, 
    read, 
    update,
    destroy,
}
