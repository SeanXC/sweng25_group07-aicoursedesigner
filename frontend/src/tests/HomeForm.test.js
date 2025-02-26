import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomeDashboard from './HomeDashboard';

describe('HomeForm Component', () => {
  it('toggles form visibility when button is clicked', () => {
    render(<HomeDashboard />);

    const button = screen.getByText('Sign In');
    fireEvent.click(button);

    expect(screen.getByLabelText('Course Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    render(<HomeDashboard />);

    const button = screen.getByText('Sign In');
    fireEvent.click(button);

    const courseNameInput = screen.getByLabelText('Course Name:');
    const courseDescInput = screen.getByLabelText('Description:');
    const difficultySelect = screen.getByLabelText('Difficulty:');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(courseNameInput, { target: { value: 'Spanish for Beginners' } });
    fireEvent.change(courseDescInput, { target: { value: 'Learn basic Spanish' } });
    fireEvent.change(difficultySelect, { target: { value: 'A1' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Course Data Submitted')).toBeInTheDocument();
    });
  });
});
