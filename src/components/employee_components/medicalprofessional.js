import React, { Component } from "react";
import axios from "axios";
import '../../styles/employee_styles/assign_donors.css';
import { Navigate } from "react-router-dom";

class AssignedPatients extends Component {
  state = {
    patients: [],
    errorMessage: '',
    redirecttologin: false,
  };

  async componentDidMount() {
    const username = localStorage.getItem('mpusername');

    if (!username) {
      this.setState({ errorMessage: 'No username found, please login again.' });
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/assigneddonors', {
        params: { username },
      });

      if (response.data) {
        this.setState({ patients: response.data });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      this.setState({ errorMessage: 'Failed to load patient details' });
    }
  }

  handleLogout = () => {
    localStorage.removeItem('mpusername');
    this.setState({ redirecttologin: true });
  };

  handleVerify = async (id) => {
    const confirm = window.confirm("Are you sure you want to verify this patient?");
    if (!confirm) return;

    try {
      await axios.put(`http://localhost:5000/api/assigneddonors/verify/${id}`);

      // Remove the verified patient from the list
      this.setState((prevState) => ({
        patients: prevState.patients.filter(patient => patient._id !== id)
      }));

      alert("Patient verified successfully!");
    } catch (error) {
      console.error('Error verifying patient:', error);
      alert("Failed to verify patient");
    }
  };

  render() {
    const { patients, errorMessage, redirecttologin } = this.state;
    if (redirecttologin) {
      return <Navigate to="/medicalprofessional" />;
    }

    return (
      <div className="assigned-patients-container">
        <h2 className="assigned-patients-title">Assigned Patients</h2>

        {errorMessage && <p className="assigned-patients-error">{errorMessage}</p>}

        {patients.length === 0 ? (
          <p className="assigned-patients-no-data">No unverified patients assigned to you.</p>
        ) : (
          <table className="assigned-patients-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Blood Group</th>
                <th>Assigned Date</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.name}</td>
                  <td>{patient.bloodGroup}</td>
                  <td>{new Date(patient.date).toLocaleDateString()}</td>
                  <td>{patient.address}</td>
                  <td>
                    <button
                      className="verify-btn"
                      onClick={() => this.handleVerify(patient._id)}
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="logout-btn" onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }
}

export default AssignedPatients;
