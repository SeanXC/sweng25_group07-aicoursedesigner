import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { newCourseDashboard } from 'componenets/newCourseDashboard/newCourseDashboard';

describe('newCourseDashboard Component', () => {
  it('renders "new Course Dashboard"', () => {
    render(
      <CourseDataProvider>
        <MemoryRouter>
          <newCourseDashboard />
        </MemoryRouter>
      </CourseDataProvider>
    );
    //expect(screen.getByText('')).toBeInTheDocument();
});

});