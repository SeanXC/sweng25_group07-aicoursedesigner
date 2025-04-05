import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignOut from '../components/SignOut/SignOut';
import { CourseDataProvider } from '../components/Context/CourseDataContext';


describe('SignOut Component', () => {
  it('renders "Sign Out"', () => {
    render(
      <CourseDataProvider>
        <MemoryRouter>
          <SignOut />
        </MemoryRouter>
      </CourseDataProvider>
    );

       expect(screen.getByText('Successfully Signed Out')).toBeInTheDocument();
  });

  it('navigates to /login when "Go to Sign In" is clicked', () => {
      render(
        <CourseDataProvider>
          <MemoryRouter initialEntries={['/']}>
             <Routes>
               <Route path="/" element={<SignOut />} />
               <Route path="/login" element={<div>Login Page</div>} />
             </Routes>
          </MemoryRouter>
        </CourseDataProvider>
      );

    const signInButton = screen.getByText('Go to Sign In');
    fireEvent.click(signInButton);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });


});