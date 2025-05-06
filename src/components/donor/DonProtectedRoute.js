import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
const api_uri = process.env.REACT_APP_API_URI;

class DonProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${api_uri}/api/donor/profile`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        this.setState({ isAuthorized: true });
      }
    } catch (error) {
      this.setState({ isAuthorized: false });
    }
  }

  render() {
    const { isAuthorized } = this.state;
    const { children } = this.props;

    if (isAuthorized === null) {
      return <div>Loading...</div>; // Render a loading state while checking authorization
    }

    if (!isAuthorized) {
      return <Navigate to="/donor/Donorlogin" />; // Redirect to login if unauthorized
    }

    return <>{children}</>; // Render protected children components if authorized
  }
}

export default DonProtectedRoute;
