import React, { useState } from "react";
import Navbar from "../components/Navbar.js";

// Component for signing in a user
export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // For navigating to different page when signed in
  let successSignin = false;

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    // When submit pressed, make api call
    await fetch("http://localhost:5000/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .then(async response => {
      // If the HTTP response is 2xx then response.ok will have a value of true
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
        // throw new Error(response.statusText)
      } else {
        successSignin = true;
        // we have an ok from the backend, so we are authenticated (signed in)
        // either pass the "isAuthenticated" key OR a userJSON object inside of response
        //localStorage.setItem(response.userJson);
        // each time we navigate to a new page check local storage again
        // to make sure user is signed in
        sessionStorage.setItem("isAuthenticated", true);
      }
      // return the promise(response.json) so that the next .then can resolve the promise
      return response.json();
    })
    .then(data => {
      // resolve the promise (response.json) as a user record
      let userRecordString = JSON.stringify(data);
      // get rid of escape characters in user record string
      userRecordString = unescape(userRecordString);
      // make string into json
      let userRecord = JSON.parse(userRecordString);
      // store the user record into session storage to access it on userhomepage
      sessionStorage.setItem("userRecordID", userRecord.user_info._id);
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    // Navigate to user homepage if signin success (Should be own user profile)
    if (successSignin) {
      window.location.href = "/userhome";
    }
  }

  return (
    <div>
      <Navbar page="Signin" />
      <div className="container" style={{textAlign: 'center'}}>
        <h3 >Sign in</h3>
        <div className="container">
          <div className="row" style={{flex: '1', justifyContent: 'center', textAlign: 'left'}}>
            {/* bootstrap responsive design
          width of  columns on a 12 column grid:
          for xs (mobile) sign up takes whole screen (12 cols)
          for med page size, sign up takes 6 columns
          for large page size, sign up takes 5 cols
          */}
            <div className="col-lg-5 col-md-6 col-xs-12">
              <form
                className="border shadow-sm rounded p-3 mb-3"
                onSubmit={onSubmit}
              >
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={form.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="submit"
                    value="Sign In"
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
