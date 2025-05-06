import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ScheduleTable from '../components/employee_components/assign_doctor'; // adjust as needed
const api_uri = process.env.REACT_APP_API_URI;

// Mock axios
jest.mock('axios');

const mockScheduleData = [
  {
    _id: '1',
    name: 'John Doe',
    bloodGroup: 'A+',
    date: new Date().toISOString(),
    timeSlot: '10:00 - 11:00',
    address: '123 Main St',
    doctor: 'Dr. Smith',
  },
];

const mockDoctorList = [
  { username: 'Dr. Smith' },
  { username: 'Dr. Jane' },
];

describe('ScheduleTable Component (API focus)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays schedule and doctors from API', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockScheduleData }) // for assigndoctor
      .mockResolvedValueOnce({ data: mockDoctorList });   // for doctors

    render(<ScheduleTable />);

    // Wait for data to be displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    });

    // Verify both GET requests made
    expect(axios.get).toHaveBeenCalledWith(`${api_uri}/api/assigndoctor`);
    expect(axios.get).toHaveBeenCalledWith(`${api_uri}/api/doctors`);
  });

  test('sends PUT request to update doctor when Save is clicked', async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockScheduleData })
      .mockResolvedValueOnce({ data: mockDoctorList });

    axios.put.mockResolvedValueOnce({ data: { success: true } });

    render(<ScheduleTable />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dr. Smith')).toBeInTheDocument();
    });

    // Change doctor dropdown
    fireEvent.change(screen.getByDisplayValue('Dr. Smith'), {
      target: { value: 'Dr. Jane' },
    });

    // Click Save
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${api_uri}/api/updateDoctor/1`,
        { doctor: 'Dr. Jane' }
      );
    });
  });
});
