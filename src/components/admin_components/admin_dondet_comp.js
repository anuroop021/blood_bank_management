import React from 'react';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

class AdminDonDet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      donors: [],
    };
  }

  componentDidMount() {
    this.fetchDonors();
  }

  fetchDonors = async () => {
    try {
      const response = await fetch(`${api_uri}/api/donorAD`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ donors: data });
      } else {
        console.error('Failed to fetch donors:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  render() {
    return (
      <div className="ddiv">
        <table id="donTab">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Blood Group</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {this.state.donors.map((donor) => (
              <tr key={donor._id}>
                <td>{donor.donorName}</td>
                <td>{donor.phone}</td>
                <td>{donor.bloodGroup}</td>
                <td>{donor.email}</td>
                <td>{donor.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AdminDonDet;
