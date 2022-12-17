import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ViewReservation from "../components/reservations/ViewReservation";
import TablesMain from "../components/tables/TablesMain";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tableError, setTableError] = useState(null);

  const history = useHistory();
  const query = useQuery();
  const route = useRouteMatch();

  /**
   *  a useEffect that fetches new data every time a
   * new date is present by using the url as the guide.
   */
  useEffect(() => {
    function getNewDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    getNewDate();
  }, [query, route, setDate]);
  useEffect(loadDashboard, [date]);

  /**
   * calling on the api to get our reservations by
   * a specific date.
   * @returns listReservations & tables
   */
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTableError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTableError);
    return () => abortController.abort();
  }

  /**
   * @reservationlist fetches customers with dates of today, tomorrow, or previous date.
   * @tablesList fetches ....
   */
  const reservationList = reservations.map((reservation) => {
    if (reservation.status === "cancelled" || reservation.status === "finished")
      return null;
    return (
      <ViewReservation
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });

  const tablesList = tables.map((table) => (
    <TablesMain key={table.table_id} table={table} />
  ));

  /**
   * @previous date - needs to call a function instead of an object when inside the return ui
   */

  return (
    <main>
      <h1 className="text-center" style={{ marginTop: "15px" }}>
        Dashboard
      </h1>
      <div className="d-md-flex mb-3">
        <button
          className="btn btn-dark"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          className="btn btn-info"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-dark"
          style={{ padding: "7px 15px", marginRight: "10px" }}
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <h3>Reservations for: {date}</h3>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tableError} />

      <div>
        <div>{reservationList}</div>
      </div>
      <div>
        <h3 className="mt-4 text-center">Tables</h3>
        <div>{tablesList}</div>
      </div>
    </main>
  );
}

export default Dashboard;
