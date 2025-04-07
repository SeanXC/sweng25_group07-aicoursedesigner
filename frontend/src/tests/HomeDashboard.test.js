import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomeDashboard from '../components/Home/Home';
import { CourseDataProvider } from '../components/Context/CourseDataContext';
import { UserProfileProvider } from '../components/Context/UserProfileContext';

describe('HomeDashboard Component', () => {
  it('renders "Home Dashboard" and "Sign In" button', () => {
    render(
      <UserProfileProvider>
        <CourseDataProvider>
          <MemoryRouter>
            <HomeDashboard />
          </MemoryRouter>
        </CourseDataProvider>
      </UserProfileProvider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('navigates to /login when "Sign In" is clicked', () => {
    render(
      <UserProfileProvider>
        <CourseDataProvider>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<HomeDashboard />} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </CourseDataProvider>
      </UserProfileProvider>
    );

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders links to "Generate Course"', () => {
    sessionStorage.setItem('email', 'test@example.com');

    render(
      <UserProfileProvider>
        <CourseDataProvider>
          <MemoryRouter>
            <HomeDashboard />
          </MemoryRouter>
        </CourseDataProvider>
      </UserProfileProvider>
    );

    expect(screen.getByText('Generate Course')).toBeInTheDocument();
  });
});
