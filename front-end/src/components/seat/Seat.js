import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, seatReservation } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";

function Seat() {
  const initialState = { table_id: "" };

  const [reservation, setReservation] = useState({ people: 0 });
  const [showError, setShowError] = useState(null);

  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState(initialState);

  const { reservation_id } = useParams();
  const history = useHistory();
  const abortController = new AbortController();
  const externalImage =
    "https://www.creativefabrica.com/wp-content/uploads/2021/09/21/Wood-Background-Wood-Texture-Background-Graphics-17652269-1-580x387.jpg";

  /**
   * useEffect will fetch the reservation and the tables being used, then will hold the
   * informaiton into setTables and reservations.
   */
  useEffect(() => {
    const abortController = new AbortController();
    const initial = { table_id: "" };
    setFormData(initial);

    async function fetchReservation() {
      try {
        const getData = await readReservation(
          reservation_id,
          abortController.signal
        );
        setReservation(getData);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    async function fetchTables() {
      try {
        const getData = await listTables(abortController.signal);
        setTables(getData);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    fetchReservation();
    fetchTables();
    return () => abortController.abort();
  }, [reservation_id]);

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  // handle submit
  async function handleSubmit(event) {
    event.preventDefault();
    const table_id = Number(formData.table_id);
    const reservation = parseInt(reservation_id);
    setShowError(null);
    setFormData(initialState);
    try {
      await seatReservation(reservation, table_id, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  const tableOptions = tables.map((table) => {
    const disabled = Number(table.capacity) < Number(reservation.people);
    return (
      <option key={table.table_id} value={table.table_id} disabled={disabled}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <main
      style={{
        backgroundImage: `url(${externalImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "brightness(1)",
        padding: "85px",
        borderRadius: "15px",
      }}
    >
      <div className="container fluid my-3">
        <ErrorAlert error={showError} />
        <div
          className="d-md-flex mb-3"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="table_id"
              style={{ marginRight: "10px", color: "whitesmoke" }}
            >
              <h4>Seat Table: </h4>
              <select
                name="table_id"
                onChange={handleChange}
                style={{ marginRight: "10px" }}
              >
                <option>Select Table</option>
                {tableOptions}
              </select>
            </label>
            <button
              className="btn btn-secondary"
              type="submit"
              style={{ marginRight: "10px" }}
            >
              Submit
            </button>
            <button className="btn btn-dark" onClick={() => history.goBack()}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Seat;
