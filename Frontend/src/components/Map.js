import React, { Component } from "react";
import {GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import CurrentLocation from "./CurrentLocation";
import addCommas from "../util/AddCommas";

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state ={
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      list: [],
    };
  }
  
  componentDidMount() {
    // save self as current this state because .then is an event handler
    // the event handler redefines 'this'
    // create a pointer to 'this' so that we can use set state of the component
    let self = this;

    // Fetch all island data from backend
    fetch("http://localhost:5000/islands", {
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
      // Resolve the promise: Set the react state to the data returned by backend (list of island objects)
      self.setState({
        list: data,
      });
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  }

  // Function that handles marker click, displays information window with selected markers info
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  
  // Function that handles closing of info window
  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  render() {
    // Get list of islands from react state
    const list = this.state.list;
    const listItems = list.map((item) =>
      <Marker key={item._id}
          position={{ lat: item.latitude, lng: item.longitude }}
          onClick={this.onMarkerClick}
          name={item.name}
          id={item._id}
          image={item.islandImg}
          amount={item.price}
          rating={item.rating}
      />
    );
    return (
      <div>
        {list.length > 0 &&
        <CurrentLocation centerAroundCurrentLocation google={this.props.google}>
          <Marker onClick={this.onMarkerClick} name={"Current Location"} />
          {listItems}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div class="col-xs" style={{maxHeight: 400, maxWidth: 400}}>
              <h4 style={{display: 'flex',  justifyContent:'center'}}>{this.state.selectedPlace.name}</h4>
              {this.state.selectedPlace.name !== "Current Location" &&
                  <img src={this.state.selectedPlace.image} alt="Island" style= {{
                    flex: 1,
                    width: '100%',
                    height: '60%',
                    resize: 'contain'}}
                  />
              }
              {this.state.selectedPlace.rating !== undefined &&
                <h5 style={{display: 'flex',  justifyContent:'center', margin: 10, background: 'royalblue', color: 'white', borderRadius: '50px'}}>
                  Rating: {this.state.selectedPlace.rating.toFixed(2)} / 5.00
                </h5>
              }
              {this.state.selectedPlace.amount && 
                <h5 style={{display: 'flex',  justifyContent:'center', margin: 10}}>
                  Price: ${addCommas(this.state.selectedPlace.amount.toFixed(2))}/night
                </h5>
              }
              {this.state.selectedPlace.id &&
                <a href={`/reserve?island=${this.state.selectedPlace.id}`} style={{display: 'flex',  justifyContent:'center'}} className="btn btn-primary btn-lg active -sm">
                  Reserve Island
                </a>
              }
            </div>
          </InfoWindow>
        </CurrentLocation>
        }
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBSwfjL3VFjn1vAE2t0wfRi4Y8b5S1aYy0",
})(Map);
