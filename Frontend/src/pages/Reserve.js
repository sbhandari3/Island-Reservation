import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar.js";
import moment from "moment";
import ShowReviews from "../components/ShowReviews.js";
import addCommas from "../util/AddCommas.js";

export default function Reserve() {
  // State for the reservation form
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });
  // State for the island that is selected for reservation
  const [island, setIsland] = useState({});
  
  // State for the island's reviews
  const [reviews, setReviews] = useState([]);

  // Get id of logged in user
  let userId = sessionStorage.getItem("userRecordID");

  // Get selected island ID
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let islandId = params.get('island');

  // Get todays date so user cant reserve past 3pm same day
  let today = moment();
  if(today.get('hours') > 14){
    today = moment().add(1, 'days').format('YYYY-MM-DD');
  } else {
    today = moment().format('YYYY-MM-DD');
  }

  // Calculate number of days and total price
  let numDays = Math.floor((Date.parse(form.endDate) - Date.parse(form.startDate)) / 86400000);
  let totalPrice = island.price * numDays;

  // For navigating to different page when successfully reserved
  let successAddBalance = false;
  const navigate = useNavigate();

  // This method will update the form as use is putting in dates
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    const reservationInfo = { ...form }
    reservationInfo.amountPaid = totalPrice;

    // When submit pressed, make api call to add reservation
    await fetch(`http://localhost:5000/reservations/add/${userId}/${islandId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationInfo),
    })
      .then(async (response) => {
        const data = await response.json();
        // If the HTTP response is 2xx then response.ok will have a value of true
        if (!response.ok) {
          throw new Error(data.message);
          // throw new Error(response.statusText)
        } else {
          successAddBalance = true;
        }
      })
      .catch((error) => {
        console.log("Error thrown after: .catch((error) =>");
        window.alert(error);
        return;
      });

    // Navigate to signin page if signup success
    if (successAddBalance) {
      console.log("Sucess");
      navigate("/userhome");
    } else {
      console.log("Not Sucess");
    }
  }

  // useEffect is similar to componentDidMount, get selected island info and its reviews
  useEffect(() => {
    // Fetch currently selected islands information
    fetch("http://localhost:5000/island?id=" + islandId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      // If the HTTP response is 2xx then response.ok will have a value of true
      if (!response.ok) {
        const data = response.json();
        throw new Error(data.message);
      }
      // return the promise(response.json) so that the next .then can resolve the promise
      return response.json();
    })
    .then(data => {
      // resolve the promise: Set island state to data retrieved from backend
      setIsland(data);
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    // Fetch reviews associated with currently selected island
    fetch("http://localhost:5000/user/review?id=" + islandId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => {
      if (!response.ok) {
        const data = response.json();
        throw new Error(data.message);
      }
      return response.json();
    })
    .then(data => {
      // Set reviews state to data retrieved from backend
      setReviews(data)
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }, [islandId])

  return (
    <div>
      <Navbar page="Reserve" />
      {island.price > 0 && 
      <div className="container">
        <div className="card">
        <h3 className="card-title" style={{display: 'flex',  justifyContent:'center'}}>Reserve {island.name}</h3>
        <div className="card-body">
          <div className="card">
            <div className="row text-center">
              <img src={island.islandImg} style={{flex: '1', aspectRatio: 3/2, resize: 'contain'}} alt="Island"
                className="img-responsive img-circle img-thumbnail" />
              </div>
                <div className="jumbotron" style={{flex: 1, width: '100%', paddingTop: 30, paddingBottom: 20}}>
                  {island.rating !== undefined &&
                  <h5 style={{display: 'flex',  justifyContent:'center', background: 'royalblue', color: 'white', borderRadius: '50px'}}>
                    Average Rating: {island.rating.toFixed(2)} / 5.00
                  </h5>      
                  }
                  <h4 style={{marginTop: 20}}>Details</h4>
                  <p className="card-info">{island.details}</p>
                  <h4>Island Info</h4>
                  <p>Location: {island.location}</p>
                  <p>Area: {island.land_size} sq.m</p>
                  <p>Price: ${addCommas(island.price.toFixed(2))}/night</p>
              </div>
            </div>
            <form
                className="border shadow-sm rounded p-3 mb-3"
                onSubmit={onSubmit}
              >
                <div className="form-group">
                  <label htmlFor="ddmmyy">Start Date</label>
                  <input
                    type="date"
                    min={today}
                    className="form-control"
                    id="ddmmyy"
                    value={form.startDate}
                    onChange={(e) => updateForm({ startDate: e.target.value, endDate: ""})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ddmmyy">End Date</label>
                  <input
                    type="date"
                    min={moment(form.startDate).add(1,'days').format('YYYY-MM-DD')}
                    className="form-control"
                    id="ddmmyy"
                    value={form.endDate}
                    onChange={(e) => updateForm({ endDate: e.target.value })}
                  />
                </div>
                {numDays > 0 &&
                  <div style={{marginTop: '20px'}}> {"Total Days: " + numDays}</div>
                }
                {numDays > 0 &&
                  <div style={{marginTop: '20px'}}> {"Check in: " + moment(form.startDate).format('MM/DD/YYYY') + " at 3:00 PM"}</div>
                }
                {numDays > 0 &&
                  <div style={{marginTop: '20px'}}> {"Check out: " + moment(form.endDate).format('MM/DD/YYYY') + " at 12:00 PM"}</div>
                }
                {numDays > 0 &&
                  <div style={{marginTop: '20px'}}> {"Total Price: $" + addCommas(totalPrice.toFixed(2))}</div>
                }
                {numDays > 0 &&
                  <div className="form-group" style={{marginTop: '20px'}}>
                    <input
                      type="submit"
                      value="Reserve Island"
                      className="btn btn-primary"
                    />
                  </div>
                }
              </form>
              {reviews.length > 0 &&
                <div>
                  <h4 style={{marginTop: "10px", textAlign: 'center'}}>Customer Reviews</h4>
                    {reviews.map((review) =>
                      <div key={review._id}>
                        <ShowReviews item={review}/>
                      </div>
                  )}
                </div>
              }
          </div>
        </div>
      </div>
    }
    </div>
  );
}
