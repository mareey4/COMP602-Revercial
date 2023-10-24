// Import necessary libraries and utilities
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Text from '../Back End/CreateAcc'; 
import { MemoryRouter } from "react-router-dom";
describe('<Text />', () => {
  // Basic rendering test
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
          <Text />
      </MemoryRouter>
  );   expect(screen.getByText('Create an Account')).toBeInTheDocument();
  });

  // Test if input fields exist
  it('has the required input fields', () => {
    render(
      <MemoryRouter>
          <Text />
      </MemoryRouter>
  );    expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('DOB:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  // Test if create button exists
  it('has a create button', () => {
    render(
      <MemoryRouter>
          <Text />
      </MemoryRouter>
  );      expect(screen.getByText('Create')).toBeInTheDocument();
  });

});
/* describe('CreateAcc component', () => {
  let component;

  beforeEach(() => {
    component = render(<CreateAcc />);
  });

  test('component renders without crashing', () => {
    expect(component).toBeTruthy();
  });

  test('component contains a button (assuming theres one)', () => {
    const buttonElement = component.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
}); */