import React, { Component } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Chart,
  LinearScale,
  BarElement,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Users,
  GitPullRequest,

} from "lucide-react";
import "../../styles/employee_styles/employee_dashboard.css";

Chart.register(
  LinearScale,
  BarElement,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

class EmployeeDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donorCount: 0,
      actualDonorCount: 0,
      recipientCount: 0,
      actualRecipientCount: 0,
      recipientCountByBloodType: {
        labels: [],
        datasets: [
          {
            label: "Recipient Count by Blood Type",
            data: [],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      donorCountByBloodType: {
        labels: [],
        datasets: [
          {
            label: "Donor Count by Blood Type",
            data: [],
            backgroundColor: [],
          },
        ],
      },
      doctorPatientCount: {
        labels: [],
        datasets: [
          {
            label: "Patients per Doctor",
            data: [],
            backgroundColor: [],
          },
        ],
      },
      redirectToLogin: false,
      isDarkMode: false,
      isMenuOpen: false,
    };
  }

  componentDidMount() {
    this.fetchDonorCount();
    this.fetchRecipientCount();
    this.fetchRecipientCountByBloodType();
    this.fetchDonorCountByBloodType();
    this.fetchDoctorPatientCount();

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.setState({ isDarkMode: prefersDark });
    document.body.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  toggleTheme = () => {
    this.setState((prevState) => {
      const newTheme = !prevState.isDarkMode;
      document.body.setAttribute("data-theme", newTheme ? "dark" : "light");
      return { isDarkMode: newTheme };
    });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({ isMenuOpen: !prevState.isMenuOpen }));
  };

  fetchDoctorPatientCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctor-patient-count");
      const data = response.data;
      const doctors = data.map((item) => item._id);
      const patientCounts = data.map((item) => item.count);
      const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
      this.setState({
        doctorPatientCount: {
          labels: doctors,
          datasets: [
            {
              label: "Patients per Doctor",
              data: patientCounts,
              backgroundColor: colors.slice(0, doctors.length),
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching doctor patient count:", error);
    }
  };

  fetchDonorCountByBloodType = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/donor-count-by-blood-type");
      const data = response.data;
      const bloodGroups = data.map((item) => item._id);
      const counts = data.map((item) => item.count);
      const colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#F7464A",
        "#46BFBD",
      ];
      this.setState({
        donorCountByBloodType: {
          labels: bloodGroups,
          datasets: [
            {
              label: "Donor Count by Blood Type",
              data: counts,
              backgroundColor: colors.slice(0, bloodGroups.length),
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching donor count by blood type:", error);
    }
  };

  fetchDonorCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/donor-count");
      this.setState({ actualDonorCount: response.data.donorCount }, this.incrementDonorCount);
    } catch (error) {
      console.error("Error fetching donor count:", error);
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
      const response = await axios.get("http://localhost:5000/api/recipient-count");
      this.setState({ actualRecipientCount: response.data.recipientCount }, this.incrementRecipientCount);
    } catch (error) {
      console.error("Error fetching recipient count:", error);
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
      const response = await axios.get("http://localhost:5000/api/recipient-count-by-blood-type");
      const data = response.data;
      const bloodTypes = data.map((item) => item._id);
      const counts = data.map((item) => item.count);
      this.setState({
        recipientCountByBloodType: {
          labels: bloodTypes,
          datasets: [
            {
              label: "Recipient Count by Blood Type",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching recipient count by blood type:", error);
    }
  };

  handleLogout = () => {
    localStorage.removeItem("username");
    this.setState({ redirectToLogin: true });
  };

  render() {
    const {
      donorCount,
      recipientCount,
      recipientCountByBloodType,
      donorCountByBloodType,
      doctorPatientCount,
      redirectToLogin,
      isDarkMode,
    } = this.state;

    if (redirectToLogin) {
      return <Navigate to="/employee/login" />;
    }

    return (
      <div className="employee-dashboard">
        <motion.div
          className="dashboard-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-grid">
            <motion.div className="stat-card" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Users className="stat-icon" />
              <h3>Total Donors</h3>
              <p className="stat-number">{donorCount}</p>
            </motion.div>

            <motion.div className="stat-card" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GitPullRequest className="stat-icon" />
              <h3>Blood Requests</h3>
              <p className="stat-number">{recipientCount}</p>
            </motion.div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h3>Blood Requests by Type</h3>
              <Bar
                data={recipientCountByBloodType}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: isDarkMode ? "#333" : "#ddd" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>

            <div className="pie-charts">
              <div className="chart-card">
                <h3>Donor Blood Types</h3>
                <Pie data={donorCountByBloodType} />
              </div>

              <div className="chart-card">
                <h3>Patients per Doctor</h3>
                <Pie data={doctorPatientCount} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.employees?.employee?.username,
});

export default connect(mapStateToProps)(EmployeeDashboard);
