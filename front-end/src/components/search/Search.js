import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { listReservations } from "../../utils/api";
import ViewReservation from "../reservations/ViewReservation";


const Search = () => {
  //image
const externalImage = "https://worldarchitecture.org/cdnimgfiles/extuploadc/15xxzwluzwil9549.jpg"
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
        )) : null;

  return (
    <main style={{
      backgroundImage: `url(${externalImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      filter: "brightness(0.8)" + "brightness(1.3)",
      padding: "85px", 
      borderRadius: "15px",
      }}>
      <div className="d-md-flex mb-3" style={{ justifyContent: "center", alignItems: "center"}}>
          <h3 style={{color: "white"}}>Search for a reservation by phone number</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <form onSubmit={handleSubmit}>
            <input
              id="mobile_number"
              type="text"
              name="mobile_number"
              onChange={handleChange}
              value={FormData.mobile_phone}
              placeholder="(---) --- ----"
              required
              />
            &nbsp;
            <button type="submit" className="btn btn-dark">
              Find Reservation
            </button>
          </form>
        <div>
          {searchResults}
        </div>
      
        <ErrorAlert error={showError} />

          </div>
    </main>
  );
};

export default Search;
