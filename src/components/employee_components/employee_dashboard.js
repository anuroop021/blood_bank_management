import React from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, LinearScale, BarElement, Title, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import '../../styles/employee_styles/employee_dashboard.css';
const api_uri = process.env.REACT_APP_API_URI;

Chart.register(LinearScale, BarElement, Title, CategoryScale, ArcElement, Tooltip, Legend);

class Dashboard extends React.Component {
  state = {
    donorCount: 0,
    actualDonorCount: 0,
    recipientCount: 0,
    actualRecipientCount: 0,
    recipientCountByBloodType: {
      labels: [],
      datasets: [
        {
          label: 'Recipient Count by Blood Type',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    },
    donorCountByBloodType: {
      labels: [],
      datasets: [
        {
          label: 'Donor Count by Blood Type',
          data: [],
          backgroundColor: [],
        },
      ],
    },
    doctorPatientCount: {
      labels: [],
      datasets: [
        {
          label: 'Patients per Doctor',
          data: [],
          backgroundColor: [],
        },
      ],
    },
    redirectToLogin: false,
  };

  componentDidMount() {
    this.fetchDonorCount();
    this.fetchRecipientCount();
    this.fetchRecipientCountByBloodType();
    this.fetchDonorCountByBloodType();
    this.fetchDoctorPatientCount();
  }

  fetchDoctorPatientCount = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/doctor-patient-count`);
      const data = response.data;

      const doctors = data.map((item) => item._id);
      const patientCounts = data.map((item) => item.count);

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; 

      this.setState({
        doctorPatientCount: {
          labels: doctors,
          datasets: [
            {
              label: 'Patients per Doctor',
              data: patientCounts,
              backgroundColor: colors.slice(0, doctors.length),
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching doctor patient count:', error);
    }
  };

  fetchDonorCountByBloodType = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/donor-count-by-blood-type`);
      const data = response.data;

      const bloodGroups = data.map((item) => item._id);
      const counts = data.map((item) => item.count);

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#F7464A', '#46BFBD'];

      this.setState({
        donorCountByBloodType: {
          labels: bloodGroups,
          datasets: [
            {
              label: 'Donor Count by Blood Type',
              data: counts,
              backgroundColor: colors.slice(0, bloodGroups.length),
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching donor count by blood type:', error);
    }
  };

  fetchDonorCount = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/donor-count`);
      this.setState({ actualDonorCount: response.data.donorCount }, this.incrementDonorCount);
    } catch (error) {
      console.error('Error fetching donor count:', error);
    }
  };

  incrementDonorCount = () => {
    const { actualDonorCount } = this.state;
    const interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.donorCount < actualDonorCount) {
          return { donorCount: prevState.donorCount + 1 };
        } else {
          clearInterval(interval);
          return null;
        }
      });
    }, 100);
  };

  fetchRecipientCount = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/recipient-count`);
      this.setState({ actualRecipientCount: response.data.recipientCount }, this.incrementRecipientCount);
    } catch (error) {
      console.error('Error fetching recipient count:', error);
    }
  };

  incrementRecipientCount = () => {
    const { actualRecipientCount } = this.state;
    const interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.recipientCount < actualRecipientCount) {
          return { recipientCount: prevState.recipientCount + 1 };
        } else {
          clearInterval(interval);
          return null;
        }
      });
    }, 100);
  };

  fetchRecipientCountByBloodType = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/recipient-count-by-blood-type`);
      const data = response.data;

      const bloodTypes = data.map((item) => item._id);
      const counts = data.map((item) => item.count);

      this.setState({
        recipientCountByBloodType: {
          labels: bloodTypes,
          datasets: [
            {
              label: 'Recipient Count by Blood Type',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error fetching recipient count by blood type:', error);
    }
  };

  handleLogout = () => {
    localStorage.removeItem('username');
    this.setState({ redirectToLogin: true });
  };

  render() {
    const {donorCount, recipientCount, recipientCountByBloodType, donorCountByBloodType, doctorPatientCount, redirectToLogin } = this.state;

    if (redirectToLogin) {
      return <Navigate to="/employeeLogin" />;
    }

    const { username } = this.props;

    return (
      <div className="dashboard-container">
        <h1 id="greeting">Welcome, {username}!</h1>

        <div className="stat-boxes">
          <div className="stat-box">
            <h3>Total Donors</h3>
            <p>{donorCount}</p>
          </div>
          <div className="stat-box">
            <h3>Blood Requests</h3>
            <p>{recipientCount}</p>
          </div>
        </div>

        <div className="chart-container">
          <Bar
            data={recipientCountByBloodType}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Pending Blood Requests',
                  font: {
                    size: 20,
                  },
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
                legend: {
                  display: true,
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    callback: function (value) {
                      return Number.isInteger(value) ? value : '';
                    },
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>

        <div className="pie-charts-row">
          <div className="pie-chart">
            <h3>Donor Blood Types Distribution</h3>
            <Pie
              data={donorCountByBloodType}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'right',
                  },
                },
              }}
            />
          </div>

          <div className="pie-chart">
            <h3>Patients per Doctor</h3>
            <Pie
              data={doctorPatientCount}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="dashboard-footer">
          <button className="employee-logout-button" onClick={this.handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.employees.employee.username,
});

export default connect(mapStateToProps)(Dashboard);