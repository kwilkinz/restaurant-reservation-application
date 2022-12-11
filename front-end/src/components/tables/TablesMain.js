import React, { useState } from "react";
import ErrorAlert from "../../layout/ErrorAlert";
import { clearTable } from "../../utils/api";

const TablesMain = ({ table }) => {
    const [showError, setShowError] = useState(null);
    const { table_name, capacity, table_id, reservation_id } = table;

    async function handleClick(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const message = "Is this table ready to seat new guests? This cannot be undone.";
        setShowError(null);
        if (window.confirm(message)) {
          try {
            await clearTable(
              table_id,
              abortController.signal
            );
            window.location.reload(true);
          } catch (error) {
            if (error.name !== "AbortError") setShowError(error);
          }
        }
      }

      const finishTable = reservation_id ? (
        <div>
          <button
            className="btn btn-danger"
            style={{marginTop: "10px"}}
            data-table-id-finish={table_id}
            onClick={handleClick}
          >Finish
          </button>
          </div>
      ) : (
        <></>
      );

    return (
        <div>
            <ErrorAlert error={showError} />
            <table className="table table-hover">
                <thead className="thead-light">
                 <tr>
                    <th scope="col">Table</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Id</th>
                    <th scope="col">Status</th>
                    <th></th>
                
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" style={{width: "25%"}}>{table_name}</th>
                    <th style={{width: "25%"}}>{capacity}</th>
                    <th style={{width: "25%"}}>{table_id}</th>
                    <th style={{width: "15%"}} data-table-id-status={table_id}>{reservation_id ? "Occupied" : "Free"}</th>
                    <div>{finishTable}</div>
                </tr>
            </tbody>
            </table>
        </div>
    )
}

export default TablesMain;