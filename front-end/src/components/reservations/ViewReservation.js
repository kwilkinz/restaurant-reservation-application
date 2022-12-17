import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { updateStatus } from "../../utils/api";

const ViewReservation = ({ reservation }) => {
  const [showError, setShowError] = useState(null);

  // handle cancel
  async function handleCancel(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Do you want to cancel this reservation? This cannot be undone.";
    if (window.confirm(message)) {
      try {
        await updateStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
  }

  return (
    <div>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Full Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">People</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th
              scope="row"
              style={{ width: "5%" }}
              data-reservation-id-status={reservation.reservation_id}
            >
              {reservation.status}
            </th>
            <th style={{ width: "20%" }}>
              {reservation.first_name} {reservation.last_name}
            </th>
            <th>{reservation.mobile_number}</th>
            <th>{reservation.people}</th>
            <th>{reservation.reservation_date}</th>
            <th>{reservation.reservation_time}</th>
            <th style={{ padding: "5px" }}>
              <ErrorAlert error={showError} />
              {reservation.status === "booked" ? (
                <button className="btn btn-secondary">
                  <a
                    href={`/reservations/${reservation.reservation_id}/seat`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Seat
                  </a>
                </button>
              ) : null}
            </th>
            <th style={{ padding: "5px" }}>
              <button className="btn btn-info">
                <a
                  href={`/reservations/${reservation.reservation_id}/edit`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Edit
                </a>
              </button>
            </th>
            <th style={{ padding: "5px" }}>
              <button
                className="btn btn-dark"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ViewReservation;
