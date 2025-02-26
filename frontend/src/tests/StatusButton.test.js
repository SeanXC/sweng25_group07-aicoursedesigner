import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatusButton from './StatusButton';

// Mock the global fetch function to simulate different responses
global.fetch = jest.fn();

describe('StatusButton Component', () => {
  it('displays "Not connected" when fetch fails', async () => {
    // Simulate a failed fetch
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<StatusButton />);

    const button = screen.getByText('Check Connection');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Status: Not connected')).toBeInTheDocument();
    });
  });

  it('displays success message when fetch is successful', async () => {
    // Simulate a successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ body: '{"message":"Connected successfully!"}' })
    });

    render(<StatusButton />);

    const button = screen.getByText('Check Connection');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Status: Connected successfully!')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch returns an error status', async () => {
    // Simulate a fetch error response
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    render(<StatusButton />);

    const button = screen.getByText('Check Connection');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Status: Error: 404')).toBeInTheDocument();
    });
  });
});
