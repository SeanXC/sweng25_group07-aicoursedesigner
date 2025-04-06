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
    // The three buttons
    expect(screen.getByText('Translation')).toBeInTheDocument();
    expect(screen.getByText('Roleplay')).toBeInTheDocument();
    expect(screen.getByText('Chatbot')).toBeInTheDocument();
});

  it('navigates to generateRoleplay when "Roleplay Button" is clicked', () => {
    render(
      <CourseDataProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<courseDashboard />} />
          </Routes>
        </MemoryRouter>
      </CourseDataProvider>
    );
    const roleplayButton = screen.getByText('Roleplay');
    fireEvent.click(roleplayButton);

    expect(screen.getByText('Generate Roleplay')).toBeInTheDocument();
  });

});