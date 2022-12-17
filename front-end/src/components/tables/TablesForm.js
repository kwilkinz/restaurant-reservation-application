import React, { useState } from "react";
import { createTable } from "../../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../../layout/ErrorAlert";

const TablesForm = () => {
  //image
  const externalImage =
    "https://blog.grandrapidschair.com/hubfs/grey-skies-harper-a-frame-horizontal-image.jpg";

  // Initial Form State
  const initialState = {
    table_name: "",
    capacity: 1,
  };

  // useStates
  const [formData, setFormData] = useState({ ...initialState });
  const [showError, setShowError] = useState(false);

  // imports
  const abortController = new AbortController();
  const history = useHistory();

  // handle change
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  // handle Submit
  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);
    const newTable = {
      table_name: formData.table_name,
      capacity: Number(formData.capacity),
    };
    try {
      await createTable(newTable, abortController.signal);
      setFormData(initialState);
      history.push(`/dashboard`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => {
      abortController.abort();
    };
  }
  return (
    <main>
      <div
        style={{
          backgroundImage: `url(${externalImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: "87%",
          filter: "brightness(1.1)",
          padding: "80px",
          borderRadius: "15px",
        }}
      >
        <ErrorAlert className="alert alert-danger" error={showError} />
        <div style={{ justifyContent: "center", textAlign: "center" }}>
          <h1 style={{ color: "whitesmoke", filter: "brightness(0.9)" }}>
            Create a New Table
          </h1>
          <form onSubmit={handleSubmit}>
            {/* table name */}
            <label htmlFor="table_name" style={{ color: "whitesmoke" }}>
              <h5>Table Name:</h5>
            </label>
            <input
              id="table_name"
              type="text"
              name="table_name"
              onChange={handleChange}
              value={formData.table_name}
              placeholder="Bar #3"
              required
              style={{ width: "20%", margin: "8px", textAlign: "center" }}
            />
            {/* Capacity */}
            <label htmlFor="capacity" style={{ color: "whitesmoke" }}>
              <h5>Table Capacity:</h5>
            </label>
            <input
              id="capacity"
              type="number"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
              required
              style={{ width: "30%", margin: "8px", textAlign: "center" }}
            />
            <div>
              {/* Submit Bttn */}
              <button
                style={{ paddingLeft: "25px", paddingRight: "25px" }}
                className="btn btn-secondary shadow"
                type="submit"
              >
                Submit
              </button>
              &nbsp;
              {/* Cancel Bttn */}
              <button
                style={{ paddingLeft: "25px", paddingRight: "25px" }}
                className="btn btn-dark shadow "
                type="button"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default TablesForm;
