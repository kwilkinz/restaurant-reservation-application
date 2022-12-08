import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../../utils/api";

const ReservationMain = ({ date }) => {
  // Initial Form State
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date,
    reservation_time: "10:30:00",
    people: 1,
    status: "",
  };

  // useStates
  const [formData, setFormData] = useState({ ...initialState });
  const [showError, setShowError] = useState(false);

  // imports
  const abortController = new AbortController();
  const params = useParams();
  const history = useHistory();

  // format date
  const formatDate = (date) => {
    let formatedDate = date.split("");
    formatedDate.splice(10);
    formatedDate = formatedDate.join("");
    return formatedDate;
  }

  // format time
  const formatTime = (time) => {
    let formatedTime = time.split("");
    formatedTime.splice(5);
    formatedTime = formatedTime.join("");
    return formatedTime;
  }

  // handle change  
  async function handleChange({ target }) {
    const { name, value } = target;
    switch (name) {
      case "people":
        setFormData({ ...formData, [name]: parseInt(value) });
        break;
      case "reservation_date":
        setFormData({ ...formData, [name]: formatDate(value) });
        break;
      case "reservation_time":
        setFormData({ ...formData, [name]: formatTime(value) });
        break;
      default:
        setFormData({ ...formData, [name]: value });
        break;
    }
  }

  // handle Submit 
  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);
    const newRes = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      people: Number(formData.people),
      status: "booked",
    };
    try {
      await createReservation(newRes, abortController.signal);
      formData(initialState);
      history.push(`/dashboard?date=${newRes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }

    return () => {
      abortController.abort();
    };
  }

  return (
    <div>
      <h1>Make a New Reservation</h1>
      <div className="d-md-flex mb-3">
        <ErrorAlert error={showError} />
        <ReservationForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ReservationMain;
