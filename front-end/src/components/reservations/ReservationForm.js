import React from "react"; 
import { useHistory } from "react-router-dom";

const ReservationForm = ({ formData, handleChange, handleSubmit }) => {
    const history = useHistory();
    return (
        <div>
            <form onSubmit={handleSubmit}>
                {/* first name */}
                <label htmlFor="first_name">First Name:</label>
                <input 
                    id="first_name"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                />
                {/* last name */}
                <label htmlFor="last_name">Last Name:</label>
                <input 
                    id="last_name"
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                />
                 {/* mobile number */}
                <label htmlFor="mobile_number">Phone Number:</label>
                <input 
                    id="mobile_number"
                    type="tel"
                    name="mobile_number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    placeholder="(---) --- ----"
                    required
                />
                 {/* Reservation date */}
                 <label htmlFor="reservation_date">Date of Reservation:</label>
                 <input 
                    id="reservation_date"
                    type="date"
                    name="reservation_date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    pattern="\d{4}-\d{2}-\d{2}"
                    placeholder="YYYY-MM-DD"
                    required
                />
                 {/* Reservation time */}
                 <label htmlFor="reservation_time">Time of Reservation:</label>
                 <input 
                    id="reservation_time"
                    type="time"
                    name="reservation_time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    pattern="[0-9]{2}:[0-9]{2}"
                    placeholder="HH:MM"
                    required
                />
                {/* Reservation time */}
                 <label htmlFor="people">Number of people in party (must be more than 1):</label>
                 <input 
                    id="people"
                    type="number"
                    name="people"
                    onChange={handleChange}
                    value={formData.people}
                    min={1}
                    placeholder={1}
                    required
                />
                <div>
                    {/* Submit Bttn */}
                    <button 
                        className="btn btn-primary"
                        type="submit"
                        > Submit
                    </button>
                    &nbsp;
                    {/* Cancel Bttn */}
                    <button 
                        className="btn btn-secondary"
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