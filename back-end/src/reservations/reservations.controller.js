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
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",]
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, excluding Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations can only be made from 10:30AM - 9:30PM.",
    });
  }
  next();
}

// if booked 
function isBooked(req, res, next) {
  const { data } = req.body; 
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: "A new reservation cannot be created with a status of seated or finished.",
    });
  }
  return next();
}

// if reservation exists 
async function ifReservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id ? reservation_id : ""} Not Found`,
  });
}

// ============= ========== ================ ================== ==============

// Create a new reservation
async function create(req, res, next) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation })
};


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
  create: [
    hasValidProperties,
    dataValidation,
    isBooked,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
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
};
