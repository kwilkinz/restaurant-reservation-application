 const router = require("express").Router();
 const controller = require("./reservations.controller");
 const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * Dev Notes: 
 * lists all reservations and allows to create new reservations. 
 * using the reservation_id allowing to update and read them. 
 * changing the status is allowed through updateStatus.
 */


router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

router.route("/:reservation_id")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)

router.route("/:reservation_id/status")
    .put(controller.updateStatus)
    .all(methodNotAllowed)

module.exports = router;
