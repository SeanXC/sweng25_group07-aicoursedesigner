import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeDashboard from './HomeDashboard';

describe('HomeDashboard Component', () => {
  it('renders "Home Dashboard" and "Sign In" button', () => {
    render(
      <MemoryRouter>
        <HomeDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('navigates to /login when "Sign In" is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <HomeDashboard />
      </MemoryRouter>
    );

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    expect(window.location.pathname).toBe('/login');
  });

  it('renders links to "Generate Course" and "Connect AWS"', () => {
    render(
      <MemoryRouter>
        <HomeDashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Generate Course')).toBeInTheDocument();
    expect(screen.getByText('Connect AWS')).toBeInTheDocument();
  });
});
