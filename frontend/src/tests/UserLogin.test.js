import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserLogin from '../components/UserLogin/UserLogin';
import { CourseDataProvider } from '../components/Context/CourseDataContext';


describe('UserLogin Component', () => {
  it('renders "User Login"', () => {
    render(
      <CourseDataProvider>
        <MemoryRouter>
          <UserLogin />
        </MemoryRouter>
      </CourseDataProvider>
    );

       expect(screen.getByText('Forget Password?')).toBeInTheDocument();
  });

});