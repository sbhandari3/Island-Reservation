import React from "react";
import Navbar from "../components/Navbar.js";

// Component for signing out a user
class SignOut extends React.Component {
  componentDidMount() {
    // signing out: clear the session storage
  	sessionStorage.clear();

    // allow page to show for 3 seconds, which displays "Signing out..."
    setTimeout(function() {
      window.location.href = "/";
    }, 3000);
  }

  render() {
    return (
      <>
        <Navbar page="Signout" />
        <div style={{width: '100%', height: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem'}}>Signing Out ...</div>
      </>
    );
  }
}
export default SignOut;
