const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// ======================== Middleware ========================

const dateFormatted = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormatted = /[0-9]{2}:[0-9]{2}/;

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "Requires valid property",
    });
  }

  /**
   * Checking Properties :
   * 1st. if no property it needs to require one.
   * 2nd. requires the people to be a Number.
   * 3rd. requires the reservation date to be formatted correctly.
   * 4th. requires the time to be formatted correctly.
   */
  VALID_PROPERTIES.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `Requires ${property}`,
      });
    }

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `Requires ${property} to be a number`,
      });
    }

    if (
      property === "reservation_date" &&
      !dateFormatted.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `Requires ${property} to be properly formatted as YYYY-MM-DD`,
      });
    }

    if (
      property === "reservation_time" &&
      !timeFormatted.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be properly formatted as HH:MM`,
      });
    }
  });
  next();
}

// Verifying conditions of days
function isValidDay(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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

/**
 * the reservation has to  start off as booked and can only be edited if the client
 * is either free or booked.
 * Cannot change once seated or client is finished.
 */
function isBooked(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "A new reservation cannot be created with a status of seated or finished",
    });
  }
  next();
}

function notFinished(req, res, next) {
  const { reservation_id } = req.params;
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
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

// ======================== ========== ========================

// create a new reservation using "form" data
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

/**
 * List handler for reservation resources either by
 * date or mobile phone number
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (date) {
    reservations = await service.listByDate(date);
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
  }
  res.json({ data: reservations });
}

// read the reservations
function read(req, res) {
  res.json({ data: res.locals.reservation });
}

/**
 * update the current reservation using the reservation_id being passed in
 * via Url (req.body) and then update sending back the updated reservation
 * */
async function update(req, res, next) {
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  service
    .update(updated)
    .then((data) => res.json({ data: data }))
    .catch(next);
}

/**
 * update the status of the current reservation if booked or seated
 * using the current status of the reservation update then return
 */
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

function validStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatuses = ["booked", "cancelled", "finished", "seated"];
  if (validStatuses.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next({
      status: 400,
      message:
        "Status unknown! Status must be set to 'booked', 'seated', 'canceled' or 'finished'",
    });
  }
}

module.exports = {
  create: [
    hasValidProperties,
    isValidDay,
    isBooked,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    notFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
