import React from 'react';
import Navbar from '../components/Navbar.js'

// Component for user settings, updates user's info
class Settings extends React.Component {
  constructor(props) {
  		super(props);
  		this.state = {
        userRecord: null,
        fname: "",
        lname: "",
        password: ""
  		}
  }

  componentDidMount() {
    let self = this;
    // get the user's id (never changes) from sessionStorage (stored upon sign in)
    let userid = sessionStorage.getItem("userRecordID");

    // fetch to get user first name and last name and username to display
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
      // resolve the promise: response.json(), into data and store as state's userRecord
      self.setState({userRecord: data.user_info});
      self.setState({fname: data.user_info.firstname});
      self.setState({lname: data.user_info.lastname});
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }

  performUpdate(api, data) {
    let userid = sessionStorage.getItem("userRecordID");
    fetch("http://localhost:5000/user/update/" + api + "?id=" + userid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      // If the HTTP response is 2xx then response.ok will have a value of true
      if (!response.ok) {
        const data = response.json();
        throw new Error(data.message);
        // throw new Error(response.statusText)
      }
      // return the promise(response.json) so that the next .then can resolve the promise
      return response.json();
    })
    .then(data => {

    })
    .catch(error => {
      // window.alert(error);
      return;
    });
  }

  changeFname = (ev) => {
    let fname = ev.target.value;
    this.setState({fname: fname});
  };
  changeLname = (ev) => {
    let lname = ev.target.value;
    this.setState({lname: lname});
  };
  changePassword = (ev) => {
    let password = ev.target.value;
    this.setState({password: password});
  };

  onSubmit = () => {
    let userid = sessionStorage.getItem("userRecordID");
    if (this.state.fname !== this.state.userRecord.firstname) {
      let updatefirstnameData = {id: userid}
      updatefirstnameData.firstname = this.state.fname;
      this.performUpdate("firstname", updatefirstnameData);
    }
    if (this.state.lname !== this.state.userRecord.lastname) {
      let updatelastnameData = {id: userid}
      updatelastnameData.lastname = this.state.lname;
      this.performUpdate("lastname", updatelastnameData);
    }
    if (this.state.password.length > 0) {
      let updatepasswordData = {id: userid}
      updatepasswordData.password = this.state.password;
      this.performUpdate("password", updatepasswordData);
    }
  };

  render() {
    return (
      <>
      <Navbar  page="Settings"/>
      <div className="container">
        <h3 style={{textAlign: 'center'}}>Update Your Information</h3>
        <div className="container">
        <div className="row">
        {/* bootstrap responsive design
          width of  columns on a 12 column grid:
          for xs (mobile) sign up takes whole screen (12 cols)
          for med page size, sign up takes 6 columns
          for large page size, sign up takes 5 cols
          */}
        <div className="offset-lg-3 col-lg-6 col-xs-12">
        <form className="border shadow-sm rounded p-3 mb-3" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="fname">First Name</label>
            <input
              type="text"
              className="form-control"
              id="fname"
              value={this.state.fname || ''}
              onChange={this.changeFname}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lname">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lname"
              value={this.state.lname || ''}
              onChange={this.changeLname}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="*******"
              minLength={8}
              value={this.state.password || ''}
              onChange={this.changePassword}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary"
            />
          </div>
        </form>
        </div>
        </div>
        </div>
      </div>
      </>
    );
  }
}
export default Settings;
