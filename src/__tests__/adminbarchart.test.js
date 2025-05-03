import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Barchart from '../components/admin_components/barchart_component';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock canvas context to avoid Chart.js errors in JSDOM
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    arc: () => {},
  });
});

describe('Barchart Component', () => {
  const mockResponse = [
    { _id: 'A+Ve', count: 10 },
    { _id: 'B+Ve', count: 15 },
    { _id: 'O+Ve', count: 5 },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading initially and then shows the chart', async () => {
    render(<Barchart />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      // Checks if canvas is rendered (Chart.js renders inside <canvas>)
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  test('calls API to fetch blood group counts', async () => {
    render(<Barchart />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/blood-group-counts');
    });
  });
});
