import React from 'react';
import '../../styles/AdminStyles/admin.css';

class AdminTransDet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalTransactions: [],
      individualTransactions: [],
      hospitalPage: 0,
      individualPage: 0,
      transactionsPerPage: 10,
      dateRange: 'all',
    };
  }

  componentDidMount() {
    this.fetchTransactions();
  }

  fetchTransactions = async () => {
    try {
      const response = await fetch('/api/paymentTransactions');
      if (response.ok) {
        const data = await response.json();
        this.filterTransactionsByDate(data);
      } else {
        console.error('Failed to fetch transactions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  filterTransactionsByDate = (data) => {
    const { dateRange } = this.state;
    const currentDate = new Date();
    const filteredData = data.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const diffTime = currentDate - transactionDate;

      switch (dateRange) {
        case 'lastDay':
          return diffTime <= 24 * 60 * 60 * 1000;
        case 'lastMonth':
          return diffTime <= 30 * 24 * 60 * 60 * 1000;
        case 'last3Months':
          return diffTime <= 90 * 24 * 60 * 60 * 1000;
        case 'last6Months':
          return diffTime <= 180 * 24 * 60 * 60 * 1000;
        case 'lastYear':
          return diffTime <= 365 * 24 * 60 * 60 * 1000;
        case 'all':
        default:
          return true;
      }
    });

    const hospitalTransactions = filteredData.filter((transaction) => transaction.userType === 'hospital');
    const individualTransactions = filteredData.filter((transaction) => transaction.userType === 'individual');

    this.setState({ hospitalTransactions, individualTransactions });
  };

  handlePageChange = (type, direction) => {
    this.setState((prevState) => {
      const key = type === 'Hospital' ? 'hospitalPage' : 'individualPage';
      const totalTransactions = type === 'Hospital' 
        ? prevState.hospitalTransactions.length 
        : prevState.individualTransactions.length;

      const maxPage = Math.ceil(totalTransactions / prevState.transactionsPerPage) - 1;
      let newPage = prevState[key] + (direction === 'next' ? 1 : -1);

      if (newPage < 0) newPage = 0;
      if (newPage > maxPage) newPage = maxPage;

      return { [key]: newPage };
    });
  };

  handleDateRangeChange = (event) => {
    this.setState({ dateRange: event.target.value }, this.fetchTransactions);
  };

  renderPagination = (transactions, userType, currentPage) => {
    const { transactionsPerPage } = this.state;
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => this.handlePageChange(userType, 'prev')}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => this.setState({ [`${userType.toLowerCase()}Page`]: pageNumber })}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => this.handlePageChange(userType, 'next')}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    );
  };

  renderTable = (transactions, userType, currentPage) => {
    const { transactionsPerPage } = this.state;
    const start = currentPage * transactionsPerPage;
    const end = start + transactionsPerPage;
    const currentTransactions = transactions.slice(start, end);
  
    return (
      <div className={`transaction-section ${userType.toLowerCase()}-section`}>
        <h3 className="transaction-heading">{userType} Transactions</h3>
        <table id={`${userType.toLowerCase()}-transactions-table`} className="transaction-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Transaction ID</th>
              <th>{userType === 'Hospital' ? 'Hospital ID' : 'Donor'}</th>
              <th>Blood Type</th>
              <th>Blood Units</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction, index) => (
              <tr key={transaction._id}>
                <td>{start + index + 1}</td>
                <td>{transaction.transactionID}</td>
                <td>
                {transaction.userType === 'hospital'? transaction.hospitalID || "N/A": transaction.donor || "N/A"}
                </td>
                <td>{transaction.bloodType}</td>
                <td>{transaction.bloodUnits}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transactionStatus}</td>
                <td>{new Date(transaction.transactionDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.renderPagination(transactions, userType, currentPage)}
      </div>
    );
  };

  render() {
    const { hospitalTransactions, individualTransactions, hospitalPage, individualPage } = this.state;
    return (
      <div className="admin-transactions-container">
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
        {this.renderTable(hospitalTransactions, 'Hospital', hospitalPage)}
        {this.renderTable(individualTransactions, 'Individual', individualPage)}
      </div>
    );
  }
}

export default AdminTransDet;
