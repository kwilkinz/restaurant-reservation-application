import React from "react";
import { useHistory } from "react-router-dom";

const ReservationForm = ({ formData, handleChange, handleSubmit }) => {
  const history = useHistory();
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* first name */}
        <label htmlFor="first_name" style={{ color: "whitesmoke" }}>
          <h5>First Name:</h5>
        </label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          style={{
            filter: "brightness(0.8)",
            width: "20%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        {/* last name */}
        <label htmlFor="last_name" style={{ color: "whitesmoke" }}>
          <h5>Last Name:</h5>
        </label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          style={{
            filter: "brightness(0.8)",
            width: "30%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        <br />
        {/* mobile number */}
        <label htmlFor="mobile_number" style={{ color: "whitesmoke" }}>
          <h5>Phone Number:</h5>
        </label>
        <input
          id="mobile_number"
          type="tel"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
          placeholder="(---) --- ----"
          style={{
            filter: "brightness(0.8)",
            width: "20%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        {/* Reservation date */}
        <label htmlFor="reservation_date" style={{ color: "whitesmoke" }}>
          <h5>Date of Reservation:</h5>
        </label>
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          pattern="\d{4}-\d{2}-\d{2}"
          placeholder="YYYY-MM-DD"
          style={{
            filter: "brightness(0.8)",
            width: "25%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        <br />
        {/* Reservation time */}
        <label htmlFor="reservation_time" style={{ color: "whitesmoke" }}>
          <h5>Time of Reservation:</h5>
        </label>
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          pattern="[0-9]{2}:[0-9]{2}"
          placeholder="HH:MM"
          style={{
            filter: "brightness(0.8)",
            width: "25%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        {/* Reservation time */}
        <label htmlFor="people" style={{ color: "whitesmoke" }}>
          <h5>People in party:</h5>
        </label>
        <input
          id="people"
          type="number"
          name="people"
          onChange={handleChange}
          value={formData.people}
          min={1}
          placeholder={1}
          style={{
            filter: "brightness(0.8)",
            width: "15%",
            margin: "8px",
            textAlign: "center",
          }}
        />
        <div>
          {/* Submit Bttn */}
          <button
            style={{ paddingLeft: "25px", paddingRight: "25px" }}
            className="btn btn-secondary shadow"
            type="submit"
          >
            {" "}
            Submit
          </button>
          &nbsp;
          {/* Cancel Bttn */}
          <button
            style={{ paddingLeft: "25px", paddingRight: "25px" }}
            className="btn btn-dark shadow"
            type="button"
            onClick={() => history.goBack()}
          >
            {" "}
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
