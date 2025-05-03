import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DonationHistory from '../components/donor/DonationHistory';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('DonationHistory Component', () => {

  // Test: Renders loading initially
  test('renders loading initially', () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <DonationHistory />
      </Router>
    );

    // Check for loading text
    expect(screen.getByText(/Loading donation history.../i)).toBeInTheDocument();
  });

  // Test: Displays donation history when API call is successful
  test('displays donation history when API call is successful', async () => {
    const mockDonations = [
      { date: '2021-10-12T12:00:00Z', bloodGroup: 'A+', address: 'City Hospital', doctor: 'Dr. Smith' },
      { date: '2021-11-05T15:00:00Z', bloodGroup: 'O-', address: 'Central Clinic', doctor: 'Dr. Jones' },
    ];
    
    axios.get.mockResolvedValue({ data: mockDonations });

    render(
      <Router>
        <DonationHistory />
      </Router>
    );

    // Wait for loading to finish and check the table
    await waitFor(() => expect(screen.queryByText(/Loading donation history.../i)).not.toBeInTheDocument());
    
    // Check that donation records are displayed
    expect(screen.getByText('10/12/2021')).toBeInTheDocument();
    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('City Hospital')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
  });

  // Test: Handles error when API call fails
  test('handles error when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(
      <Router>
        <DonationHistory />
      </Router>
    );

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText(/Loading donation history.../i)).not.toBeInTheDocument());
    
    // Check for error message
    expect(screen.getByText('Failed to fetch donation history. Please try again later.')).toBeInTheDocument();
  });

  // Test: Displays no donations message when there are no donations
  test('displays no donations message when there are no donations', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <DonationHistory />
      </Router>
    );

    await waitFor(() => expect(screen.queryByText(/Loading donation history.../i)).not.toBeInTheDocument());

    // Check for the no donations message
    expect(screen.getByText('No verified donations found in your history.')).toBeInTheDocument();
    expect(screen.getByText('Once your donation appointments are verified by a medical professional, they will appear here.')).toBeInTheDocument();
  });

});
