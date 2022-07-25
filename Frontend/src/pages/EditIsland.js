import React from 'react';
import Navbar from '../components/Navbar.js'

// Component for editing an island the user uploaded
class EditIsland extends React.Component {
  constructor(props) {
  		super(props);
  		this.state = {
        island_id: "",
        curr_island_record: null,
        updated_fields: {},
        island_name: "",
        location: "",
        details: "",
        price: "",
        islandImg: "",
        latitude: "",
        longitude: ""
  		}
  }

  componentDidMount() {
    let self = this;

    // get the island id which is the url parameter (use getUrlParam)
    let island_id = this.getUrlParam('id');
    self.setState({island_id: island_id});

    // fetch to get user first name and last name and username to display
    fetch("http://localhost:5000/island?id=" + island_id, {
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
      self.setState({curr_island_record: data});
      self.setState({island_name: data.name});
      self.setState({location: data.location});
      self.setState({details: data.details});
      self.setState({price: data.price});
      self.setState({islandImg: data.islandImg});
      self.setState({latitude: data.latitude});
      self.setState({longitude: data.longitude});
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }

  performUpdate() {
    // let self = this;
    // let success = false;
    console.log(this.state.updated_fields)
    
    const formData = new FormData();

    for (const field in this.state.updated_fields) {
      formData.append(field, this.state.updated_fields[field]);
    }
    
    fetch("http://localhost:5000/island/update?id=" + this.state.island_id, {
      method: "POST",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      body: formData,
      // JSON.stringify(this.state.updated_fields),
    })
    .then(response => {
      // If the HTTP response is 2xx then response.ok will have a value of true
      if (!response.ok) {
        console.log('error');
        // const data = response.json();
        // throw new Error(data.message);
        // throw new Error(response.statusText)
      }
      window.location.href = "/manage";
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }

  changeName = (ev) => {
    let value = ev.target.value;
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        name: value       // update the value of specific key
      }
    }));
    this.setState({island_name: value});
  };
  changeLocation = (ev) => {
    let value = ev.target.value;
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        location: value                 // update the value of specific key
      }
    }));
    this.setState({location: value});
  };
  changeDetails = (ev) => {
    let value = ev.target.value;
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        details: value       // update the value of specific key
      }
    }));
    this.setState({details: value});
  };
  changePrice = (ev) => {
    let value = parseInt(ev.target.value);
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        price: value       // update the value of specific key
      }
    }));
    this.setState({price: value});
  };
  changeIslandImg = (ev) => {
    let value = ev.target.files[0];
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        islandImg: value       // update the value of specific key
      }
    }));
  };
  changeLatitude = (ev) => {
    let value = ev.target.value;
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        latitude: value       // update the value of specific key
      }
    }));
    this.setState({latitude: value});
  };
  changeLongitude = (ev) => {
    let value = ev.target.value;
    this.setState(prevState => ({
    updated_fields: {                   // object that we want to update
        ...prevState.updated_fields,    // keep all other key-value pairs
        longitude: value       // update the value of specific key
      }
    }));
    this.setState({longitude: value});
  };


  onSubmit = (ev) => {
    ev.preventDefault();
    this.performUpdate();
  };

  getUrlParam = (key) => {
      let params = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&#]*)/gi, function(m, key, value) {
          params[key] = value;
      });
      return params[key] ? params[key] : null;
  };

  render() {
    return (
      <>
        <Navbar  page="Settings"/>
        <div className="container">
          <h3 style={{textAlign: 'center'}}>Edit Island: {this.state.island_name}</h3>
          <div className="container">
            <div className="row">
              <div className="offset-lg-3 col-lg-6 col-xs-12">
                <form className="border shadow-sm rounded p-3 mb-3" onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="islandname">Island Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="islandname"
                      value={this.state.island_name || ''}
                      onChange={this.changeName}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      value={this.state.location || ''}
                      onChange={this.changeLocation}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="details">Details</label>
                    <input
                      type="text"
                      className="form-control"
                      id="details"
                      value={this.state.details || ''}
                      onChange={this.changeDetails}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      value={this.state.price || ''}
                      onChange={this.changePrice}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                      type="text"
                      className="form-control"
                      id="latitude"
                      value={this.state.latitude || ''}
                      onChange={this.changeLatitude}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                      type="text"
                      className="form-control"
                      id="longitude"
                      value={this.state.longitude || ''}
                      onChange={this.changeLongitude}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    &nbsp;&nbsp;
                    <input
                      type="file"
                      id="image"
                      onChange={this.changeIslandImg}
                    />
                  <div className="form-group">
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-primary"
                    />
                  </div>
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
export default EditIsland;
