import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import Search from "../components/search/Search";
import Seat from "../components/seat/Seat";
import ReservationMain from "../components/reservations/ReservationMain";
import TablesMain from "../components/tables/TablesMain";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>


      <Route path="/dashboard/:date">
        <Dashboard />
      </Route>

      <Route path="/dashboard/">
        <Dashboard date={today()} />
      </Route>

      <Route path="/search" >
        <Search />
      </Route>
      
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

     <Route path="/reservations/:reservation_id/seat" >
        <Seat /> 
      </Route>

      <Route path="/reservations/:reservation_id/edit" >
        <ReservationMain date={today()} /> 
      </Route>

      <Route path="/reservations/new">
        <ReservationMain date={today()} />
      </Route>

      <Route path="/tables/new" >
        <TablesMain date={today()} />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
