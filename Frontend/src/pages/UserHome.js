import React from "react";
import Navbar from "../components/Navbar";
import ReservationCard from "../components/ReservationCard";
import addCommas from "../util/AddCommas";

// Component for the user home page
class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRecord: null
    };
  }

  componentDidMount() {
    // save self as current this state because .then is an event handler
    // the event handler redefines 'this'
    // create a pointer to 'this' so that we can use set state of the component
    let self = this;
    // get user id from the userRecord gathered from sign in
    let userid = sessionStorage.getItem("userRecordID");

    // fetch latest version of user data from backend
    fetch("http://localhost:5000/user?id=" + userid, {
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
      self.setState({userRecord: data});
    })
    .catch(error => {
      window.alert(error);
      return;
    });

  }
  render() {
    // let userRecord = JSON.parse(this.state.userRecordString);
    // check if no user record
    let emptyUserRecord = true;
    if (this.state.userRecord) {
      emptyUserRecord = false;
    }

    // now we have a json record of the user inside 'userRecord'
    let existing_active_reservations = this.state.userRecord &&
      this.state.userRecord.active_reservations &&
      this.state.userRecord.active_reservations.length > 0;
    let existing_past_reservations = this.state.userRecord &&
      this.state.userRecord.past_reservations &&
      this.state.userRecord.past_reservations.length > 0;

    return (
      <>
        <Navbar page="Account" />
        {!emptyUserRecord ? (
          <section className="container">
            <h1>
              {" "}
              Welcome, <span>{this.state.userRecord.user_info.firstname}</span>&nbsp;
              <span>{this.state.userRecord.user_info.lastname}</span>!
            </h1>
            <div className="row">
              <div className="col-sm-6 col-12">
                <div className="card mb-3" style={{ maxWidth: "540px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src="./userHomePageImages/suitcase.jpg"
                        alt="..."
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Book an Island</h5>
                        <p className="card-text">
                          Your dream vacation is now a reality, book with us
                          here.
                        </p>
                        <a href="/list" className="btn btn-primary">
                          Reserve
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-12">
                <div className="card mb-3" style={{ maxWidth: "540px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src="./userHomePageImages/money1.jpg"
                        alt="..."
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Your Balance</h5>
                        <p className="card-text">
                        Your account currently has a balance of&nbsp;&nbsp;&nbsp;
                        <span style={{fontWeight: 'bold', fontSize: '20px'}}>
                          {'$' + addCommas(this.state.userRecord.user_info.balance.toFixed(2))}
                          </span>.
                        </p>
                        <a href="/addcredit" className="btn btn-primary">
                          Add credit
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-12">
                <div className="card mb-3" style={{ maxWidth: "540px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src="./userHomePageImages/island1.jpg"
                        alt="..."
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Manage Your Islands</h5>
                        <p className="card-text">
                          Add an island and allow users to place bookings, or
                          update your existing island here.
                        </p>
                        <a href="/manage" className="btn btn-primary">
                          Manage
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-12">
                <div className="card mb-3" style={{ maxWidth: "540px" }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src="./userHomePageImages/rating.jpg"
                        alt="..."
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Review Your Trip</h5>
                        <p className="card-text">
                          Add a review of your vacation here.
                        </p>
                        <a href="/makereview" className="btn btn-primary">
                          Review
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-12">
              <div className="card mb-3" style={{ maxWidth: "540px" }}>
                <div className="row no-gutters">
                  <div className="col-md-4">
                    <img
                      src="./userHomePageImages/settings.jpg"
                      alt="..."
                      className="img-thumbnail"
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">Account Settings</h5>
                      <p className="card-text">
                        Manage your account information.
                      </p>
                      <a href="/settings" className="btn btn-primary">
                        Settings
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title" style={{fontSize: '25px'}}>Active Reservations</h5>
                    <div className="card-text">
                      {existing_active_reservations ?
                        this.state.userRecord.active_reservations.map(function (entry, i) {
                          return (
                            <ReservationCard key={"active-reservation-" + i} idx={i} entry={entry}/>
                          )
                        }) :
                        <div>No Active Reservations</div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title" style={{fontSize: '25px'}}>Past Reservations</h5>
                    <div className="card-text">
                    {existing_past_reservations ?
                      this.state.userRecord.past_reservations.map(function (entry, i) {
                        return (
                          <ReservationCard key={"past-reservation-" + i} idx={i} entry={entry}/>
                        )
                      }) :
                      <div>No Past Reservations</div>
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="container">Loading User Record ...</section>
        )}
      </>
    );
  }
}
export default UserHome;
