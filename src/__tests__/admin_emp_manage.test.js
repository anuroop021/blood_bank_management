import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminEmp from '../components/admin_components/admin_empManage_comp';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AdminEmp Component', () => {
  const mockEmployees = [
    {
      _id: '1',
      username: 'Alice',
      shift: 'Morning',
      contact: '1234567890',
      address: '123 Main St',
      email: 'alice@example.com',
    },
    {
      _id: '2',
      username: 'Bob',
      shift: 'Evening',
      contact: '9876543210',
      address: '456 Market St',
      email: 'bob@example.com',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      if (!options) {
        // GET request
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEmployees),
        });
      } else if (options.method === 'DELETE') {
        // DELETE request
        return Promise.resolve({ ok: true });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders table headers correctly', async () => {
    render(
      <Router>
        <AdminEmp />
      </Router>
    );

    expect(await screen.findByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('Contact Number')).toBeInTheDocument();
    expect(screen.getByText('Update/Remove')).toBeInTheDocument();
  });

  test('fetches and displays employee data', async () => {
    render(
      <Router>
        <AdminEmp />
      </Router>
    );

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('removes an employee when "Remove" button is clicked', async () => {
    render(
      <Router>
        <AdminEmp />
      </Router>
    );

    // Wait for data to load
    await waitFor(() => screen.getByText('Alice'));

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]); // Click remove for Alice

    await waitFor(() => {
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });
});
