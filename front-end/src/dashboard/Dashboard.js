import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom"; 
import useQuery from  "../utils/useQuery";
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
        setDate(queryDate)
      } else {
        setDate(today())
      }
    }
    getNewDate();
  }, [query, route, date])
  useEffect(loadDashboard, [date]);

  /**
   * calling on the api to get our reservations by 
   * a specific date. 
   * @returns listReservations & tables 
   */
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTableError)
    return () => abortController.abort();
  };

/**
 * xxx
 */
const reservationList = reservations.map((reservation) => {
  if (reservation.status === "cancelled" || reservation.status === "finished") return null;
  return ( <ViewReservation key={reservation.reservation_id} reservation={reservation}/> )
});

const tablesList = tables.map((table) => (
  <TablesMain key={table.table_id} table={table}/>
));
  

  return (
    <main>
      <h1 className="text-center">Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
        <button
          className="btn btn-dark"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
          >Previous
        </button>
        <button
          className="btn btn-info"
          onClick={() => history.push(`/dashboard?date=${previous(today())}`)}
          >Today
        </button>
        <button
          className="btn btn-dark"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >Next
        </button>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tableError} />

      <div>
        <div>{reservationList}</div>
      </div>

      <div>
        <h3>Tables</h3>
        <div>{tablesList}</div>
      </div>
      
    </main>
  );
}

export default Dashboard;
