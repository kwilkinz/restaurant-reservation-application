import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { updateStatus } from "../../utils/api";

const ViewReservation = ({ reservation }) => {
  const [showError, setShowError] = useState(null);

  // handle cancel
  async function handleCancel(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message = "Do you want to cancel this reservation? This cannot be undone.";
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
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">{reservation.status}</th>
          <th style={{width: "20%"}}>{reservation.first_name} {reservation.last_name}</th>
          <th>{reservation.mobile_number}</th>
          <th>{reservation.people}</th>
          <th>{reservation.reservation_date}</th>
          <th>{reservation.reservation_time}</th>
        </tr>
        <div>
          <tr>
            <th>
          <ErrorAlert error={showError} />
          {reservation.status === "booked" ? (
            <button className="btn btn-success my-3 mr-3 px-3 py-2">
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                style={{ color: "white", textDecoration: "none" }}
              >Seat
              </a>
            </button>
          ) : null}</th><th>
          <button className="btn btn-warning px-3 py-2">
            <a
              href={`/reservations/${reservation.reservation_id}/edit`}
              style={{ color: "white", textDecoration: "none" }}
            >Edit
            </a>
          </button></th><th>
          <button
            className="btn btn-secondary mx-3 px-3 py-2"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
          > Cancel
          </button></th>
          </tr>
        </div>
      </tbody>
    </table>
     
    </div> 
  );
};

export default ViewReservation;
