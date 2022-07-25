import React from "react";
import ReactDOM from "react-dom";

// Styling for the map
const mapStyles = {
  map: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "calc(100vh - 86px)",
  },
};

// Component for the map with current location
export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);
    const { latitude, longitude } = this.props.Center;
    this.state = {
      userLocation: {
        lat: latitude,
        lng: longitude,
      },
    };
  }

  // Whenever component mounts, get location and update state
  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coordinates = pos.coords;
          this.setState({
            userLocation: {
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            },
          });
        });
      }
    }
    this.loadMap();
  }

  // Helper function that loads the map
  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const referencemap = this.refs.map;
      const node = ReactDOM.findDOMNode(referencemap);
      let { zoom } = this.props;
      const { latitude, longitude } = this.state.userLocation;
      const center = new maps.LatLng(latitude, longitude);

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom,
          streetViewControl: false,
          fullscreenControl: false,
        }
      );

      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);
    }
  }

  // Map reconfigures if userlocation changes
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.userLocation !== this.state.userLocation) {
      this.recenterMap();
    }
  }

  // Helper function that recenters map if current location changes
  recenterMap() {
    const map = this.map;
    const place = this.state.userLocation;
    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(place.lat, place.lng);
      map.panTo(center);
    }
  }

  // Function that only renders map if props are defined
  renderChildren() {
    const { children } = this.props;
    if (!children) return;
    return React.Children.map(children, (c) => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.userLocation,
      });
    });
  }

  // Render the map with current location
  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <div id="map_canvas" style={{ width: "100%", height: "100%" }}>
        <div style={style} ref="map"></div>
        {this.renderChildren()}
      </div>
    );
  }
}

// Define default props, set initial center to Santa Cruz
CurrentLocation.defaultProps = {
  zoom: 3,
  Center: {
    lat: 36.999,
    lng: -109.0452,
  },
  centerAroundCurrentLocation: true,
  visible: true,
};

export default CurrentLocation;
