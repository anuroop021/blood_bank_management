import React from 'react';
import '../../styles/AdminStyles/admin.css';
import { Link } from 'react-router-dom';
const api_uri = process.env.REACT_APP_API_URI;

class AdminMedic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medics: [],
    };
  }

  componentDidMount() {
    this.fetchMedics();
  }

  fetchMedics = async () => {
    try {
      const response = await fetch(`${api_uri}/api/medics`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ medics: data });
      } else {
        console.error('Failed to fetch medics:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching medics:', error);
    }
  };

  removeMedic = async (id) => {
    try {
      const response = await fetch(`${api_uri}/api/medics/${id}`, { method: 'DELETE' });
      if (response.ok) {
        this.setState({
          medics: this.state.medics.filter((medic) => medic._id !== id),
        });
      } else {
        console.error('Failed to remove medic:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing medic:', error);
    }
  };

  render() {
    return (
      <>
        <div className="ddiv">
          <table id="donTab">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Update/Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.medics.map((medic) => (
                <tr key={medic._id}>
                  <td>{medic.username}</td>
                  <td>{medic.role}</td>
                  <td>{medic.contactNumber}</td>
                  <td>{medic.email}</td>
                  <td>
                    <div id="manipul">
                      <Link className="lin" to={`/Admin/medicUpdate/${medic._id}`}>
                        <button id="update">Update</button>
                      </Link>
                      <button
                        id="remove"
                        onClick={() => this.removeMedic(medic._id)}
                        style={{
                          color: 'white',
                          padding: '10px',
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
          <Link className="addemplink" to="/Admin/addmed">Add Medic</Link>
        </div>
      </>
    );
  }
}

export default AdminMedic;
