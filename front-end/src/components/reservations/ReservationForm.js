import React from "react"; 
import { useHistory } from "react-router-dom";

const ReservationForm = ({ formData, handleChange, handleSubmit }) => {
    const history = useHistory();
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* first name */}
                <label htmlFor="first_name" style={{color: "white"}}>First Name:</label>
                <input 
                    id="first_name"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                    style={{ width: "20%", margin: "8px", textAlign: "center" }}
                />
                {/* last name */}
                <label htmlFor="last_name"  style={{color: "white"}}>Last Name:</label>
                <input 
                    id="last_name"
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                    style={{ width: "30%", margin: "8px", textAlign: "center" }}
                />
                <br />
                 {/* mobile number */}
                <label htmlFor="mobile_number"  style={{color: "white"}}>Phone Number:</label>
                <input 
                    id="mobile_number"
                    type="tel"
                    name="mobile_number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    placeholder="(---) --- ----"
                    required
                    style={{ width: "20%", margin: "8px", textAlign: "center" }}
                />
                 {/* Reservation date */}
                 <label htmlFor="reservation_date" style={{color: "white"}}>Date of Reservation:</label>
                 <input 
                    id="reservation_date"
                    type="date"
                    name="reservation_date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="YYYY-MM-DD"
                    required
                    style={{ width: "25%", margin: "8px", textAlign: "center" }}
                />
                < br />
                 {/* Reservation time */}
                 <label htmlFor="reservation_time" style={{color: "white"}}>Time of Reservation:</label>
                 <input 
                    id="reservation_time"
                    type="time"
                    name="reservation_time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    pattern="[0-9]{2}:[0-9]{2}"
                    placeholder="HH:MM"
                    required
                    style={{ width: "25%", margin: "8px", textAlign: "center" }}
                />
                {/* Reservation time */}
                 <label htmlFor="people" style={{color: "white"}}>People in party:</label>
                 <input 
                    id="people"
                    type="number"
                    name="people"
                    onChange={handleChange}
                    value={formData.people}
                    min={1}
                    placeholder={1}
                    required
                    style={{ width: "15%", margin: "8px", textAlign: "center" }}
                />
                <div>
                    {/* Submit Bttn */}
                    <button style={{paddingLeft: "25px", paddingRight: "25px"}}
                        className="btn btn-success shadow"
                        type="submit"
                        > Submit
                    </button>
                    &nbsp;
                    {/* Cancel Bttn */}
                    <button style={{paddingLeft: "25px", paddingRight: "25px"}}
                        className="btn btn-secondary shadow"
                        type="button"
                        onClick={() => history.goBack()}
                        > Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReservationForm;