import React from 'react';
import { Navigate } from 'react-router-dom';
import HospitalPayment from './hosp_pay';

class HospitalMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedOut: false,
    };
  }

  handleSignOut = async () => {
    try {
      const response = await fetch('/api/hospitalLogout', {
        method: 'POST',
        credentials: 'include', 
      });
  
      if (response.ok) {
        window.location.href = "/hospital"; 
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  render() {
    if (this.state.isLoggedOut) {
      return <Navigate to="/hospital" />;
    }

    return (
      <div>
        <div className="mdiv">
          <h1>Welcome</h1>
          <button id="signout" onClick={this.handleSignOut}>Sign Out</button>
          
        </div>
        <div><HospitalPayment/></div>
      </div>
    );
  }
}

export default HospitalMain;
