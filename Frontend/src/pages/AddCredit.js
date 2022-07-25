import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar.js";

// Page for adding credit to a users account, is a simple form
export default function AddCredit() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    cardnum: "",
    expdate: "",
    cvc: "",
    addamount: "",
  });

  // Get logged in user info
  let userid = sessionStorage.getItem("userRecordID");

  // For navigating to different page when successfully added balance
  let successAddBalance = false;
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    // Get submitted form data
    const newCard = { ...form };

    // When submit pressed, make api call
    await fetch(`http://localhost:5000/user/addcredit/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCard),
    })
      .then(async (response) => {
        const data = await response.json();
        // If the HTTP response is 2xx then response.ok will have a value of true
        if (!response.ok) {
          throw new Error(data.message);
        } else {
          successAddBalance = true;
        }
      })
      .catch((error) => {
        console.log("Error thrown after: .catch((error) =>");
        window.alert(error);
        return;
      });

    // Navigate to user home page if successfully added balance
    if (successAddBalance) {
      console.log("Sucess");
      navigate("/userhome");
    } else {
      console.log("Not Sucess");
    }
  }

  return (
    <div>
      <Navbar page="Add Credit" />
      <div className="container">
        <h3 style={{textAlign: 'center'}}>Add Credit</h3>
        <div className="container">
          <div className="row">
            {/* bootstrap responsive design
          width of  columns on a 12 column grid:
          for xs (mobile) sign up takes whole screen (12 cols)
          for med page size, sign up takes 6 columns
          for large page size, sign up takes 5 cols
          */}
            <div className="offset-lg-3 col-lg-6 col-xs-12">
              <form
                className="border shadow-sm rounded p-3 mb-3"
                onSubmit={onSubmit}
              >
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    value={form.firstname}
                    onChange={(e) => updateForm({ firstname: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    value={form.lastname}
                    onChange={(e) => updateForm({ lastname: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardnum">Credit Card Number</label>
                  <input
                    type="tel"
                    inputmode="numeric"
                    pattern="[0-9\s]{13,19}"
                    autocomplete="cc-number"
                    maxlength="19"
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="form-control"
                    id="cardnum"
                    value={form.cardnum}
                    onChange={(e) => updateForm({ cardnum: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mmyy">Expiration Date</label>
                  <input
                    type="month"
                    className="form-control"
                    id="mmyy"
                    value={form.expdate}
                    onChange={(e) => updateForm({ expdate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvc">CVC Number</label>
                  <input
                    type="number"
                    max="999"
                    min={0}
                    pattern="([0-9]|[0-9]|[0-9])"
                    className="form-control"
                    id="cvc"
                    value={form.cvc}
                    onChange={(e) => updateForm({ cvc: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount (USD)</label>
                  <input
                    type="number"
                    min="0.01"
                    max="1000000000.00"
                    step="0.01"
                    className="form-control"
                    id="amount"
                    required={true}
                    value={form.addamount}
                    onChange={(e) => updateForm({ addamount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Add to Balance"
                    className="btn btn-primary"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
