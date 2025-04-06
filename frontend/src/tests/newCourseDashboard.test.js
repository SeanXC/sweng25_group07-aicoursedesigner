import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import  newCourseDashboard  from 'componenets/newCourseDashboard/newCourseDashboard';
import { CourseDataProvider } from '../components/Context/CourseDataContext';

describe('newCourseDashboard Component', () => {

  it('render the new Course Dashboard and the 3 buttons', () => {
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
});