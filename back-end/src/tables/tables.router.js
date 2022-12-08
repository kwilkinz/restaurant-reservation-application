const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

// US-04 
router.route("/:table_id")
    .get(controller.read)
    .all(methodNotAllowed);

// US-04 Seat Reservation
router.route("/:table_id/seat")
    .put(controller.update)
    .delete(controller.clearSeat)
    .all(methodNotAllowed);

module.exports = router;