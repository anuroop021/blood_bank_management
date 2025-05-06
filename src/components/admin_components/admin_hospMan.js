import React from 'react';
import '../../styles/AdminStyles/admin.css';
import { Link } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;


class AdminHosp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Hospitals: [],
    };
  }

  componentDidMount() {
    this.fetchHospitals();
  }

  fetchHospitals = async () => {
    try {
      const response = await fetch(`${api_uri}/api/hospitals`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ Hospitals: data });
      } else {
        console.error('Failed to fetch Hospitals:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Hospitals:', error);
    }
  };

  removeHospital = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/hospitals/remove/${id}`, { method: 'DELETE' });
      if (response.ok) {
        this.setState({
          Hospitals: this.state.Hospitals.filter((Hospital) => Hospital._id !== id),
        });
      } else {
        console.error('Failed to remove Hospital:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing Hospital:', error);
    }
  };

  render() {
    return (
      <>
        <div className="ddiv">
          <table id="donTab">
            <thead>
              <tr>
                <th>Hospital Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Type</th>
                <th>Bloodbank Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.Hospitals.map((Hospital) => (
                <tr key={Hospital._id}>
                  <td>{Hospital.username}</td>
                  <td>{Hospital.address}</td>
                  <td>{Hospital.contact}</td>
                  <td>{Hospital.email}</td>
                  <td>{Hospital.type}</td>
                  <td>{Hospital.bloodbank_capacity}</td>
                  <td>
                    <div id="manipul">
                      <Link className="lin" to={`/Admin/updateHosp/${Hospital._id}`}>
                        <button id="update">Update</button>
                      </Link>
                      <button
                        id="remove"
                        onClick={() => this.removeHospital(Hospital._id)}
                        style={{
                        color: 'white',
                        padding: '10px ' ,
                        borderRadius: '1rem',
                      }}
                      >
                     Remove
                     </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

         <div className="addemp">
          <Link className="addemplink" to="/Admin/addHosp">Add Hospital</Link>
        </div> 
      </>
    );
  }
}

export default AdminHosp;
