import React from 'react';
import '../../styles/AdminStyles/admin.css';
import Barchart from './barchart_component';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

class AdmdashWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val1: 0,
      val2: 0,
      val3: 0,
      isLoggedOut: false,  
    };
  }

  componentDidMount() {
    axios.get(`${api_uri}/api/dondash`)
      .then(response => {
        const { totalBloodUnits, numberOfDonors, numberOfEmployees } = response.data;
        this.setState({
          val1: totalBloodUnits,
          val2: numberOfDonors,
          val3: numberOfEmployees,
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  handleSignOut = async () => {
    try {
      const response = await fetch(`${api_uri}/api/adminLogout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        this.setState({ isLoggedOut: true });
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  render() {
    const { val1, val2, val3, isLoggedOut } = this.state;

    if (isLoggedOut) {
      return <Navigate to="/adminLogin" />;
    }

    return (
      <>
        <div className="mdiv">
          <h1>Welcome Admin</h1>
          <button id="signout" onClick={this.handleSignOut}>Sign Out</button>
        </div>
        <div className='wrapdiv'>
          <div id="dash1" className='dash'>
            <h2>Total Blood Units</h2><br />
            <h1>{val1}</h1>
          </div>
          <div id="dash2" className='dash'>
            <h2>Number of Donors</h2><br />
            <h1>{val2}</h1>
          </div>
          <div id="dash3" className='dash'>
            <h2>Total Employees</h2>
            <h1>{val3}</h1>
          </div>
        </div>
        <div id="dash4" className='dash'>
          <h2>Blood Reserves</h2>
          <Barchart />
        </div>
      </>
    );
  }
}

export default AdmdashWelcome;
