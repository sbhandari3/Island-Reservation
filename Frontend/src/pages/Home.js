import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar.js";

// Component for user home page after login
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      widthContainer: 1400
    };
  }
  componentDidMount() {
    // reserve a this pointer to the component, must do this when using event listener
    let self = this;
    // when event is a resize of the window, we reset state var widthContainer to size of window
    window.addEventListener("resize", function(event) {
      //console.log(document.body.clientWidth + ' wide by ' + document.body.clientHeight+' high');
      self.setState({widthContainer: document.body.clientWidth});
    })
  }
  render() {
    // access the state widthContainer to remove the logo display if window is less than 1200 px
    let overPicStyle = this.state.widthContainer < 1200 ? {display: 'none'} : {};
    return (
      <>
        <Navbar page="Home" />
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-ride="carousel"
          style={{ height: "100%" }}
        >
          {/* add the logo at center of page */}
          <div className="overpic" style={overPicStyle}>
            <div className="caption">
              <img src="IRclear.png" alt="IR Home Logo"/>
            </div>
          </div>
          <ol className="carousel-indicators">
            <li
              data-target="#carouselExampleIndicators"
              data-slide-to="0"
              className="active"
            ></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage1.jpg"
                alt="First slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage2.jpg"
                alt="Second slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage3.jpg"
                alt="Third slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage4.jpg"
                alt="Fourth slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage5.jpg"
                alt="Fifth slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100 justify-content-center min-vh-100"
                src="HomePageImages/homepage6.jpg"
                alt="Sixth slide"
              />
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselExampleIndicators"
            role="button"
            data-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </>
    );
  }
}
export default Home;
