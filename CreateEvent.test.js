import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';
import CreateEvents from '../Back End/CreateEvents';
import { MemoryRouter } from 'react-router-dom';

describe('<CreateEvents />', () => {
  
  beforeEach(() => {
    render(
      <MemoryRouter>
        <CreateEvents />
      </MemoryRouter>
    );
  });

  test('renders without crashing', () => {
    const header = screen.getByText('Create an Event');
    expect(header).toBeInTheDocument();
  });

 

  test('event type dropdown is populated', () => {
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.children.length).toBe(14); // 13 event choices + 1 default option
  });




});

