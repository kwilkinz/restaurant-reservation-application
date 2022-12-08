import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations } from "../../utils/api";
import ViewReservation from "../reservations/ViewReservation";


const Search = () => {
const initialState = { mobile_number: "--- --- ----"}
    
    //useStates
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ ...initialState });
  const [showError, setShowError] = useState(null);

// handle change
function handleChange({ target }) {
    setFormData({
        ...formData,
        [target.name]: target.value,
    });
};

//handle submit
async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const searchQuery = {
        mobile_number: formData.mobile_number,
    };
    setFormData(initialState);
    setShowError(null);
    try {
        const getData = await listReservations(searchQuery, abortController.signal)
        setReservations(getData);
    } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
}

const searchResults =
    reservations.length > 0
      ? reservations.map((reservation) => (
          <ViewReservation
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))
      : "No reservations found!";

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h3>Search for a reservation by phone number</h3>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            onChange={handleChange}
            value={FormData.mobile_phone}
            required
          />
          &nbsp;
          <button type="submit" className="btn btn-dark">
            Find Reservation
          </button>
        </form>
      </div>
      <div>
         <ErrorAlert error={showError} />
         {searchResults}
      </div>
    </main>
  );
};

export default Search;
