import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MedicalprofessionalLogin from '../components/employee_components/mplogin';
const api_uri = process.env.REACT_APP_API_URI;

// Mock axios
jest.mock('axios');

describe('MedicalprofessionalLogin - Form & API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <MedicalprofessionalLogin />
      </MemoryRouter>
    );

  test('renders login form correctly', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls API and shows error on failed login', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred, please try again')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(`${api_uri}/api/medicalprofessional/login`, {
      username: 'wronguser',
      password: 'wrongpass',
    });
  });

  test('calls API and sets localStorage on successful login', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'validpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('mpusername', 'validuser');
    });
  });
});
