import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageMyProfile from '../components/donor/ManageMyProfile';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('ManageMyProfile Component', () => {

  it('renders profile data if logged in', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        bloodGroup: 'A+',
        address: '123 Main St',
      },
    });

    render(
      <Router>
        <ManageMyProfile />
      </Router>
    );

    await waitFor(() => {
      // Check if the profile data is displayed
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });
  });

  it('handles profile update successfully', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        bloodGroup: 'A+',
        address: '123 Main St',
      },
    });

    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: 'Profile updated successfully!' },
    });

    render(
      <Router>
        <ManageMyProfile />
      </Router>
    );

    // Wait for the profile data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });

    fireEvent.submit(screen.getByRole('button'));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/Profile updated successfully!/i)).toBeInTheDocument();
    });
  });

  it('handles profile update error', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        fname: 'John',
        lname: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        bloodGroup: 'A+',
        address: '123 Main St',
      },
    });

    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Failed to update profile.' } },
    });

    render(
      <Router>
        <ManageMyProfile />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Smith' },
    });

    fireEvent.submit(screen.getByRole('button'));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to update profile./i)).toBeInTheDocument();
    });
  });
});
