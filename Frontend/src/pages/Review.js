import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar.js";
import addCommas from "../util/AddCommas.js";

export default function Review() {
  const [form, setForm] = useState({
    userReview: "",
    rating: "",
  });

  // State for the island that is selected for reservation
  const [island, setIsland] = useState({});

  // Get logged in user info
  let userid = sessionStorage.getItem("userRecordID");

  // Get island id
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let islandId = params.get('island');

  // For navigating to different page when successfully adding a review
  let successAddReview = false;
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();

    // Get form data
    const newReview = { ...form };

    // When submit pressed, make api call
    await fetch(`http://localhost:5000/user/review/${userid}/${islandId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then(async (response) => {
        const data = await response.json();
        // If the HTTP response is 2xx then response.ok will have a value of true
        if (!response.ok) {
          throw new Error(data.message);
        } else {
          successAddReview = true;
        }
      })
      .catch((error) => {
        console.log("Error thrown after: .catch((error) =>");
        window.alert(error);
        return;
      });

    // Navigate to signin page if signup success
    if (successAddReview) {
      console.log("Sucess");
      navigate("/userhome");
    } else {
      console.log("Not Sucess");
    }
  }
  
  // Get currenntly selected island info from backend
  useEffect(() => {
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
      // resolve the promise: response.json(), into data as a user record
      setIsland(data);
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }, [islandId])

  return (
    <div>
      <Navbar page="Add Review" />
      <div className="container">
        <h3 style={{textAlign: 'center'}}>Review {island.name}</h3>
        <div className="container">
          {island.price > 0 &&
          <div>
            <img src={island.islandImg} style={{flex: '1', aspectRatio: 3/2, resize: 'contain'}} alt="Island"
            className="img-responsive img-circle img-thumbnail" />
            <div className="jumbotron" style={{flex: 1, width: '100%', paddingTop: 20, paddingBottom: 10}}>
              <h4>Details</h4>
              <p className="card-info">{island.details}</p>
              <h4>Island Info</h4>
              <p>Location: {island.location}</p>
              <p>Area: {island.land_size} sq.m</p>
              <p>Price: ${addCommas(island.price.toFixed(2))}/night</p>
            </div>
          </div>
          }
            {/* bootstrap responsive design
          width of  columns on a 12 column grid:
          for xs (mobile) sign up takes whole screen (12 cols)
          for med page size, sign up takes 6 columns
          for large page size, sign up takes 5 cols
          */}
            <div style={{flex: 1, width: '100%'}}>
              <form
                className="border shadow-sm rounded p-3 mb-3"
                onSubmit={onSubmit}
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              >
                <div className="form-group">
                  <label htmlFor="userReview">Type Your Review</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="userReview"
                    rows="3"
                    value={form.userReview}
                    required={true}
                    onChange={(e) => updateForm({ userReview: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating (1-5)</label>
                  <input
                    type="number"
                    className="form-control"
                    min={0}
                    max={5}
                    required={true}
                    id="rating"
                    value={form.lastname}
                    onChange={(e) => updateForm({ rating: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="submit"
                    value="Add Review"
                    className="btn btn-primary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
  );
}
