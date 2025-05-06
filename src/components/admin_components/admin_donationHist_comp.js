import React from 'react';
import '../../styles/AdminStyles/admin.css';
const api_uri = process.env.REACT_APP_API_URI;

class AdminDonHist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successfulDonations: [],
      donationPage: 0,
      donationsPerPage: 10,
      dateRange: 'all', // New state for selected date range
    };
  }

  componentDidMount() {
    this.fetchDonations();
  }

  fetchDonations = async () => {
    try {
      const response = await fetch(`${api_uri}/api/adminDonations`);
      if (response.ok) {
        const data = await response.json();
        this.filterDonationsByDate(data);
      } else {
        console.error('Failed to fetch donations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  filterDonationsByDate = (data) => {
    const { dateRange } = this.state;
    const currentDate = new Date();
    const filteredData = data.filter((donation) => {
      const donationDate = new Date(donation.date);
      const diffTime = currentDate - donationDate;

      switch (dateRange) {
        case 'lastDay':
          return diffTime <= 24 * 60 * 60 * 1000; // 1 day
        case 'lastMonth':
          return diffTime <= 30 * 24 * 60 * 60 * 1000; // 1 month
        case 'last3Months':
          return diffTime <= 90 * 24 * 60 * 60 * 1000; // 3 months
        case 'last6Months':
          return diffTime <= 180 * 24 * 60 * 60 * 1000; // 6 months
        case 'lastYear':
          return diffTime <= 365 * 24 * 60 * 60 * 1000; // 1 year
        case 'all':
        default:
          return true; // No filter
      }
    });

    // Filter only successful donations where is_verified_by_mp === 1
    const successfulDonations = filteredData.filter((donation) => donation.is_verified_by_mp === 1);
    
    this.setState({ successfulDonations });
  };

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      const totalDonations = prevState.successfulDonations.length;
      const maxPage = Math.ceil(totalDonations / prevState.donationsPerPage) - 1;
      let newPage = prevState.donationPage + (direction === 'next' ? 1 : -1);

      if (newPage < 0) newPage = 0;
      if (newPage > maxPage) newPage = maxPage;

      return { donationPage: newPage };
    });
  };

  handleDateRangeChange = (event) => {
    this.setState({ dateRange: event.target.value }, this.fetchDonations);
  };

  renderPagination = (donations, currentPage) => {
    const { donationsPerPage } = this.state;
    const totalPages = Math.ceil(donations.length / donationsPerPage);

    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => this.handlePageChange('prev')}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => this.setState({ donationPage: pageNumber })}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => this.handlePageChange('next')}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    );
  };

  renderTable = (donations, currentPage) => {
    const { donationsPerPage } = this.state;
    const start = currentPage * donationsPerPage;
    const end = start + donationsPerPage;
    const currentDonations = donations.slice(start, end);

    return (
      <div className="transaction-section">
        <h3 className="transaction-heading">Donation History</h3>
        <table id="donations-table" className="transaction-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Address</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {currentDonations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{start + index + 1}</td>
                <td>{donation.name}</td>
                <td>{donation.bloodGroup}</td>
                <td>{new Date(donation.date).toLocaleDateString()}</td>
                <td>{donation.timeSlot}</td>
                <td>{donation.address}</td>
                <td>{donation.doctor || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.renderPagination(donations, currentPage)}
      </div>
    );
  };

  render() {
    const { successfulDonations, donationPage } = this.state;
    return (
      <div className="admin-donations-container">
        <div className="date-range-filter">
          <label htmlFor="dateRange">Filter by Date: </label>
          <select id="dateRange" onChange={this.handleDateRangeChange}>
            <option value="all">All</option>
            <option value="lastDay">Last Day</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>
        {this.renderTable(successfulDonations, donationPage)}
      </div>
    );
  }
}

export default AdminDonHist;
