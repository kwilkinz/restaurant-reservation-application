import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationMain from "../components/reservations/ReservationMain";
import Seat from "../components/seat/Seat";
import EditReservation from "../components/reservations/EditReservation";
import TablesForm from "../components/tables/TablesForm";
import Search from "../components/search/search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations/new">
        <ReservationMain />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <EditReservation date={date} setDate={setDate} />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>

      <Route path="/tables/new">
        <TablesForm />
      </Route>

      <Route exact={true} path="/search">
        <Search />
      </Route>

      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
