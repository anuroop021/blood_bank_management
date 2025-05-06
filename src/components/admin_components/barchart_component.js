import React from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

class Barchart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bloodGroupCounts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchBloodGroupCounts();
  }

  fetchBloodGroupCounts = async () => {
    try {
      const response = await axios.get(`${api_uri}/api/blood-group-counts`);
      const bloodGroupCounts = response.data;

      const bloodGroups = ['A+Ve', 'A-Ve', 'B+Ve', 'B-Ve', 'AB+Ve', 'AB-Ve', 'O+Ve', 'O-Ve'];
      const counts = bloodGroups.map(group => {
        const foundGroup = bloodGroupCounts.find(item => item._id === group);
        return foundGroup ? foundGroup.count : 0; 
      });

      this.setState({ bloodGroupCounts: counts, loading: false });
    } catch (error) {
      console.error("Error fetching blood group counts:", error);
    }
  };

  render() {
    const { bloodGroupCounts, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    const data = {
      labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
      datasets: [
        {
          label: 'blood in litres (L)',
          data: bloodGroupCounts, 
          backgroundColor: 'rgba(255, 0, 0, 1)',
          borderColor: 'rgba(225, 0, 0, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Current Blood reserves(in litres)',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
}

export default Barchart;
