import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserProfile from '../components/UserProfile/userProfile';
import { CourseDataProvider } from '../components/Context/CourseDataContext';


describe('UserLogin Component', () => {
  it('renders "User Login"', () => {
    render(
      <CourseDataProvider>
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      </CourseDataProvider>
    );

       expect(screen.getByText('Language to Learn/Teach:')).toBeInTheDocument();
  });

});