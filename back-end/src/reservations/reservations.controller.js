const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// ========== ============= ====== middleware ================ ================

// Valid Properties
const VALID_PROPERTIES = [
  "first_name", 
  "last_name", 
  "mobile_number", 
  "people",
  "reservation_date",
  "reservation_time",
  "status",
  "reservation_id",
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


// Check data to make sure it matches reservation critera 
function dataValidation(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
}

// Check if the Reservation exists - using Id
async function ifReservationExists(req, res, next) {
  const { reservation_id } = req.params; 
  const reservation = await service.read(reservation_id); 
  if (reservation) {
    res.locals.reservation = reservation; 
    next();
    
  }
  return next({ status: 400, message: "Reservation cannot be found." });
}

// is booked ?? 

// ============= ========== ================ ================== ==============


// List all Reservations on a specific date or phone number.
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations; 
  if (date) {
    reservations = await service.listByDate(date);
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
  }
  res.json({ data: reservations })
};


// Create a new reservation
async function create(req, res, next) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation })
};


// Read an Existing Reservation - by Id
async function read(req, res) {
  res.json({ data: res.locals.reservation });
};


// update an existing reservation - using the id
async function update(req, res, next) {
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

// status Update - 
async function updateStatus(req, res, next) {
  const updated = {
    ...res.locals.reservation,
    status: res.locals.status,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}


// search for a reservation by - phone number 
async function search(req, res, next) {
  let { mobile_number } = req.query;
  if (!mobile_number) mobile_number = "xxx-xxx-xxxx";
  const knexInstance = req.app.get("db");
  let reservations = await service.search(knexInstance, mobile_number);
  if (reservations instanceof Error)
    return next({ message: reservations.message });
  res.json({ data: reservations });
}



module.exports = {
  listByDate: [asyncErrorBoundary(listByDate)],
  create: [
    hasValidProperties,
    dataValidation,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(ifReservationExists), read],
  update: [
    hasValidProperties,
    dataValidation,
    asyncErrorBoundary(ifReservationExists),
    asyncErrorBoundary(update),
  ],
  statusUpdate: [
    hasValidProperties,
    asyncErrorBoundary(ifReservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  search: [asyncErrorBoundary(search)],
  destroy: [
    asyncErrorBoundary(ifReservationExists),
    asyncErrorBoundary(destroy),
  ],
};
