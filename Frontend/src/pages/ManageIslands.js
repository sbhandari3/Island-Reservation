import React from "react";
import Navbar from "../components/Navbar";
import MyIslandCard from "../components/MyIslandCard";

// Page where user can add/edit their islands
class ManageIslands extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      islandRecords: null
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
    fetch("http://localhost:5000/user/islands?id=" + userid, {
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
      // self.setState({islandRecords: data});
      self.setState({islandRecords: data.user_islands});
    })
    .catch(error => {
      window.alert(error);
      return;
    });

  }
  render() {
    return (
      <>
        <Navbar page="My Islands" />
        <div className="container">
          <h3 style={{textAlign: 'center'}}>Manage Your Islands</h3>
          <div className="row">
            {this.state.islandRecords && this.state.islandRecords.length > 0 &&
              this.state.islandRecords.map(function (entry, i) {
                return (
                  <MyIslandCard key={"island-" + i} idx={i} entry={entry}/>
                )
              })
            }
            <div className="col-md-4 col-sm-6 col-xs-12" style={{margin: '15px 0'}}>
              <div className="card" style={{border: '1px solid rgba(0,0,0,.125)', width: '18rem', paddingTop: '20px'}}>
                <div style={{textAlign: 'center'}}>
                  <img className="card-img-top" src="addnewisland.jpg" alt="Add Island" style={{ height: '170px', width: '170px'}}/>
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{textAlign: 'center'}}>Add a New Island</h5>
                  <div className="card-text" style={{textAlign: 'center'}}>
                    Add your new island here. Other users may reserve your island.
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item" style={{textAlign: 'center'}}>Add your price per night.</li>
                  <li className="list-group-item" style={{textAlign: 'center'}}>Add your island's location.</li>
                  <li className="list-group-item" style={{textAlign: 'center'}}>Add your island's lat/long.</li>
                  <li className="list-group-item" style={{textAlign: 'center'}}>Add other details.</li>
                </ul>
                <div className="card-body">
                  <div style={{textAlign: 'center'}}>
                    <a href="/addisland" className="card-link">
                      Add Island
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ManageIslands;
