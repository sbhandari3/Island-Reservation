import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar.js";

// Component for signing up a user
export default function SignUp() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  // For navigating to different page when signed up
  let successSignup = false;
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

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    // When submit pressed, make api call
    await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .then(async (response) => {
        // If the HTTP response is 2xx then response.ok will have a value of true
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
          // throw new Error(response.statusText)
        } else {
          successSignup = true;
        }
      })
      .catch((error) => {
        window.alert(error);
        return;
      });

    // Navigate to signin page if signup success
    if (successSignup) {
      navigate("/user/signin");
    }
  }

  return (
    <div>
      <Navbar page="Signup" />
      <div className="container" style={{textAlign: 'center'}}>
        <h3>Sign Up</h3>
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
                    value="Sign Up"
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
