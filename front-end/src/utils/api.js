/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
 import formatReservationDate from "./format-reservation-date";
 import formatReservationTime from "./format-reservation-date";
 
 const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
 
  
 /**
  * Defines the default headers for these functions to work with `json-server`
  * added a CORS header to all 
  */
 const headers = new Headers();
 headers.append("Access-Control-Allow-Origin", "*");
 headers.append("Content-Type", "application/json");
 

 /**
  * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
  *
  * This function is NOT exported because it is not needed outside of this file.
  *
  * @param url
  *  the url for the requst.
  * @param options
  *  any options for fetch
  * @param onCancel
  *  value to return if fetch call is aborted. Default value is undefined.
  * @returns {Promise<Error|any>}
  *  a promise that resolves to the `json` data or an error.
  *  If the response is not in the 200 - 399 range the promise is rejected.
  */
 async function fetchJson(url, options, onCancel) {
   try {
     const response = await fetch(url, options);
 
     if (response.status === 204) {
       return null;
     }
 
     const payload = await response.json();
 
     if (payload.error) {
       return Promise.reject({ message: payload.error });
     }
     return payload.data;
   } catch (error) {
     if (error.name !== "AbortError") {
       console.error(error.stack);
       throw error;
     }
     return Promise.resolve(onCancel);
   }
 }
 

/**
 * Unoccupy the table in the database. 
 * @param table_id 
 * The table_id for the table to be unseated. It will change status from 
 * "occupied" to free
 * @param  signal 
 * an optional abort signal
 */
 export async function clearTable(table_id, signal) {
   const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
   const options = {
     method: "DELETE",
     headers,
     signal,
   };
   return await fetchJson(url, options);
 }
 

 /**
  * Creates a new reservation
  * @returns {Promise<{reservation}>}
  *  a promise that resolves to a possibly empty object of reservation saved in the database.
  */
 export async function createReservation(reservation, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: reservation }),
     signal,
   };
   return await fetchJson(url, options, reservation);
 }
 

 /**
  * Adds a new table to the database
  * @param table 
  * an object that contains the data information of the new table.
  * @param signal 
  * an optional abort signal
  */
 export async function createTable(table, signal) {
   const url = new URL(`${API_BASE_URL}/tables`);
   const options = {
     method: "POST",
     headers,
     body: JSON.stringify({ data: table }),
     signal,
   };
   return await fetchJson(url, options, table);
 }
 

 /**
  * Retrieves all existing reservations.
  * @returns {Promise<[reservations]>}
  * a promise that resolves to a possibly empty array of reservations saved in the database.
  */
 export async function listReservations(params, signal) {
   const url = new URL(`${API_BASE_URL}/reservations`);
   Object.entries(params).forEach(([key, value]) =>
     url.searchParams.append(key, value.toString())
   );
   return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
 }
 

 /**
  * lists all tables from the database
  * @param signal 
  *an optional abort signal
  */
 export async function listTables(signal) {
   const url = new URL(`${API_BASE_URL}/tables`);
   return await fetchJson(url, { headers, signal }, []);
 }
 

 /**
  * reads the reservations by using the reservation_id
  * @param reservation_id 
  * @param signal
  */
 export async function readReservation(reservation_id, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
   return await fetchJson(url, { headers, signal }, {});
 }
 

 /**
  * Occupy the table in the database. 
  * @param reservation_id 
  * using the reservation_id and 
  * @param table_id 
  * table_id the table can be unseated and seated.
  * @param signal 
  */
 export async function seatReservation(reservation_id, table_id, signal) {
   const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data: { reservation_id: reservation_id } }),
     signal,
   };
   return await fetchJson(url, options, {});
 }
 

 /**
  * updates a single reservation using the reservation_id
  * @param reservation 
  * @param signal 
  */
 export async function updateReservation(reservation, signal) {
   const url = new URL(
     `${API_BASE_URL}/reservations/${reservation.reservation_id}`
   );
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data: reservation }),
     signal,
   };
   return await fetchJson(url, options, reservation);
 }
 
 
 /**
  * Updates the status of a specific reservation 
  * @param reservation_id 
  * using the reservation_id it is updated. 
  * @param status 
  * an object containing that updates the field of status of a reservation.
  * @param signal 
  */
 export async function updateStatus(reservation_id, status, signal) {
   const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
   const options = {
     method: "PUT",
     headers,
     body: JSON.stringify({ data: { status } }),
     signal,
   };
   return await fetchJson(url, options, status);
 }