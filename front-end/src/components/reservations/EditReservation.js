import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { readReservation, updateReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../../layout/ErrorAlert";

const EditReservation = ({ date, setDate }) => {
  //image
  const externalImage =
    "https://worldarchitecture.org/cdnimgfiles/extuploadc/2002kinkbar2179.jpg";

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: date,
    reservation_time: "10:30:00",
    status: "",
  };

  const [formData, setFormData] = useState({ ...initialState });
  const [showError, setShowError] = useState(false);

  const abortController = new AbortController();
  const history = useHistory();
  const { reservation_id } = useParams();
  const reserId = parseInt(reservation_id);

  /**
   * developer have to use two initial states one inside the useEffect becase react uses initalstate & 
   * abort Conroller as dependencies. You can remove, but you will recive a warning (yellow) in chrome.
   */
  useEffect(() => {
    const abortController = new AbortController();
    const initialReservation = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        people: 0,
        reservation_date: "",
        reservation_time: "10:30:00",
        status: "",
      };
    async function getReservation() {
      try {
        const resData = await readReservation(reserId, abortController.signal);
        initialReservation.reservation_id = parseInt(resData.reservation_id);
        initialReservation.first_name = resData.first_name;
        initialReservation.last_name = resData.last_name;
        initialReservation.mobile_number = resData.mobile_number;
        initialReservation.reservation_date = formatDate(resData.reservation_date);
        initialReservation.reservation_time = formatTime(resData.reservation_time);
        initialReservation.people = parseInt(resData.people);
        setFormData({ ...initialReservation });
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();

    return () => abortController.abort();
  }, [reserId]);

  function formatDate(date) {
    let formatedDate = date.split("");
    formatedDate.splice(10);
    formatedDate = formatedDate.join("");
    return formatedDate;
  }

  function formatTime(time) {
    let formatedTime = time.split("");
    formatedTime.splice(5);
    formatedTime = formatedTime.join("");
    return formatedTime;
  }

  function handleChange({ target }) {
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

  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);
    const updatedReser = {
      reservation_id: reserId,
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      people: Number(formData.people),
      status: "booked",
    };
    try {
      await updateReservation(updatedReser, abortController.signal);
      history.push(`/dashboard?date=${updatedReser.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }

    return () => {
      abortController.abort();
    };
  }

  return (
    <div
      style={{
        backgroundImage: `url(${externalImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        opacity: "87%",
        padding: "80px",
        borderRadius: "15px",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>
        Make a New Reservation
      </h1>
      <div
        className="d-md-flex mb-3"
        style={{ textAlign: "center", justifyContent: "center" }}
      >
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

export default EditReservation;
