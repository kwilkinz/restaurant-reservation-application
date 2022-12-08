const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ========== ============= ====== middleware ================ ===============

const VALID_PROPERTIES = [
    "table_name", 
    "capacity",
    "reservation_id"
];

// checking if the req.body has these properties 
function hasValidProperties(req, res, next) {
    const data = ({} = req.body);
    const invalidFields = Object.keys(data).filter((field) => 
        !VALID_PROPERTIES.includes(field))
    
    if (invalidFields.length) {
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join('')}`,
        });
    };
    next();
  };


// Check if the Table exists - using Id
async function ifTableExists(req, res, next) {
    const knexInstance = req.app.get("db");
    const error =  { status: 404, message: `Table cannot be found.` };
    const { tablesId } = req.params;
    if (!tablesId) return next(error);
  
    let table = await service.read(knexInstance, tablesId);
    if (!table) return next(error);
    res.locals.table = table;
    next();
 }

// ============= ========== ================ ================== ==============

// LIST - all existing tables
async function list(req, res, next) {
    const knexInstance = req.app.get("db");
    const getTable = await service.list(knexInstance);
    if (getTable instanceof Error) return next({ message: getTable.message });
    res.json({ data: getTable })
}

// CREATE - new table 
async function create(req, res, next) {
    const knexInstance = req.app.get("db");
    const newTable = await service.create(knexInstance, req.body);
    if (newTable instanceof Error) return next({ message: newTable.message })
    res.status(201).json({ data: newTable });
}

// READ - a specific table Id
async function read(req, res) {
    const knexInstance = req.app.get("db");
    res.json({ data: res.locals.table })
}

// UPDATE - an existing table
async function update(req, res, next) {
    const knexInstance = req.app.get("db");
    const { table: { table_id: tableId, ...table},} = res.locals;
    const updatedTable = { ...table, ...req.body };
    let newTable = await service.update(knexInstance, tableId, updatedTable);
    newTable = await service.read(knexInstance, tableId);
    if (newTable instanceof Error) return next({ message: newTable.message })
    res.json({ data: newTable })
}

// UNSEAT - a reservation from the table will be paired with seat
async function unseat(req, res, next) {
    const knexInstance = req.app.get("db");
    const { table: { table_id: tableId, ...table },} = res.locals;
    const error = { status: 400, message: "Table not occupied." };
    if (table.status !== "Occupied") return next(error)

    const updatedTable = { ...table, status: "Free"};
    let newTable = await service.update(knexInstance, tableId, updatedTable);
    newTable = await service.read(knexInstance, tableId);
    if (newTable instanceof Error) return next({ message: newTable.message });
    res.json({ data: newTable });
}

// SEAT - a reservation at the new table
async function seat(req, res, next) {
    const knexInstance = req.app.get("db");
    const { table: { table_id: tableId, ...table},} = res.locals;
    const error = { status: 400, message: "Table occupied."}
    if (table.status === "Occupied") return next(error);

    const updatedTable = { ...table, ...req.body, status: "Occupied" };
    let newTable = await service.update(knexInstance, tableId, updatedTable);
    newTable = await service.read(knexInstance, tableId);
    if (newTable instanceof Error) return next({ message: newTable.message })
    res.json({ data: newTable });
}

// DESTROY - a table
async function destroy(req, res) {
    const knexInstance = req.app.get("db");
    const { table } = res.locals;
    await service.destroy(knexInstance, table.table_id);
    res.sendStatus(204);
}


mnodule.exports = {
    list: [asyncErrorBoundary(list)],
    create: [
        hasValidProperties,
        asyncErrorBoundary(create),
    ],
    read: [ifTableExists, asyncErrorBoundary(read)],
    update: [hasValidProperties, asyncErrorBoundary(update)],
    unseat: [ifTableExists, asyncErrorBoundary(unseat)],
    seat: [ifTableExists, asyncErrorBoundary(seat)],
    destroy: [ifTableExists, asyncErrorBoundary(destroy)],
}