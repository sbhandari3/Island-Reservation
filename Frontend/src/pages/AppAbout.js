import React from 'react';
import Navbar from "../components/Navbar.js";

const styles = {
  footer:{
    position:"fixed",
    bottom:0,
    left:0,
    width:'100%'
  }
};

/**
 * app home
 */
class AppAbout extends React.Component {
  //app about page
  render(){
    return (
      <>
        <Navbar page="About Us" />
        <div className='container'>
          <div className="page-header m-5">
            <h1 className='text-center'>About Island Reservation</h1>
          </div>
          <h2 className='text-center m-3'>Island Reservation’s mission is to offer our users the vacation of their dreams, and make it reality.</h2>
          <p className='text-center m-5'>Leading innovators in travel marketing platforms,
            Island Reservation was founded in 2022 by a group of engineers who wanted to prove that people didn’t
            need to dream of the perfect vacation anymore - vacations can be bigger, better and feasible. Today,
            Island Reservation allows our customers to book entire islands anywhere in the world with ease,
            and this is just the beginning. With Island Reservation offering affordable Island bookings to more and more people,
            the standards for the perfect vacation are climbing.</p>
            <footer style={styles.footer}>
            </footer>
        </div>
      </>
    )
  }
}


export default AppAbout;
