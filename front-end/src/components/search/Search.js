import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations } from "../../utils/api";
import ViewReservation from "../reservations/ViewReservation";

const Search = () => {
  //image
  const externalImage =
    "https://worldarchitecture.org/cdnimgfiles/extuploadc/15xxzwluzwil9549.jpg";

  //useStates
  const [reservations, setReservations] = useState([]);
  const [showError, setShowError] = useState(null);
  const [mobile, setMobile] = useState("");
  const [noReservations, setNoReservations] = useState(false);

  //handle change
  function handleChange({ target }) {
    setMobile(target.value);
  }

  //handle submit function
  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setShowError(null);
    listReservations({ mobile_number: mobile }, abortController.signal)
      .then((response) => {
        response.length > 0
          ? setReservations(response)
          : setNoReservations(true);
      })
      .catch(setShowError);
  }

  const searchResults = reservations.map((reservation) => (
    <ViewReservation
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));

  return (
    <div
      style={{
        backgroundImage: `url(${externalImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "(brightness(0.8) + brightness(1.3)",
        padding: "85px",
        borderRadius: "15px",
      }}
    >
      <div
        className="d-md-flex mb-3"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <h3 style={{ color: "white" }}>
          Search for a reservation by phone number
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={(event) => submitHandler(event)}>
          <label htmlFor="mobile_number">Search for reservation</label>
          <input
            name="mobile_number"
            value={mobile}
            onChange={handleChange}
            placeholder="(---) --- ----"
          />
          <button type="submit">Find</button>
        </form>
        <ErrorAlert error={showError} />
        <div>{searchResults}</div>
        {noReservations === true && <p>No reservations found</p>}
      </div>
    </div>
  );
};

export default Search;
