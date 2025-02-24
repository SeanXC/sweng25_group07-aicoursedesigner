import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeDashboard from '../Home';
import UserLogin from '../UserLogin';
import ConnectAWS from '../AWSButton';


jest.mock('../UserLogin', () => () => <div data-testid="user-login">User Login Form</div>);
jest.mock('../AWSButton', () => () => <div data-testid="aws-button">AWS Button</div>);


describe('HomeDashboard Component', () => {
  test('renders Home Dashboard with header and buttons', () => {
    render(<HomeDashboard />);

    // Check if header is present
    expect(screen.getByText('Home Dashboard')).toBeInTheDocument();

    // Check if buttons are present
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Generate Course')).toBeInTheDocument();
  });

  test('toggles login form when Sign in button is clicked', () => {
    render(<HomeDashboard />);

    // Check that UserLogin is initially NOT in the document
    expect(screen.queryByTestId('user-login')).not.toBeInTheDocument();

    // Click Sign in
    fireEvent.click(screen.getByText('Sign in'));

    // Now, the UserLogin form should appear
    expect(screen.getByTestId('user-login')).toBeInTheDocument();
  });

  test('toggles course form when Generate Course button is clicked', () => {
    render(<HomeDashboard />);

    // Ensure course input fields are not initially present
    expect(screen.queryByText('Course Name:')).not.toBeInTheDocument();

    // Click Generate Course
    fireEvent.click(screen.getByText('Generate Course'));

    // Now, the form should be visible
    expect(screen.getByText('Course Name:')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
  });

  test('hides course form when Submit button is clicked', () => {
    render(<HomeDashboard />);

    // Open the course form
    fireEvent.click(screen.getByText('Generate Course'));
    expect(screen.getByText('Course Name:')).toBeInTheDocument();

    // Click Submit
    fireEvent.click(screen.getByText('Submit'));

    // Form should be hidden again
    expect(screen.queryByText('Course Name:')).not.toBeInTheDocument();
  });

  test('renders AWSButton component', () => {
    render(<HomeDashboard />);

    // Check if AWSButton is rendered
    expect(screen.getByTestId('aws-button')).toBeInTheDocument();
  });
});
