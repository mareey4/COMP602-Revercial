// Profile.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from './Profile';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('<Profile />', () => {
  test('renders without crashing', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Profile />
      </Router>
    );
  });

  test('shows bio editing section when pencil icon is clicked', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Profile />
      </Router>
    );

    // Find the pencil icon and click on it
    const pencilIcon = screen.getByText('✎');
    fireEvent.click(pencilIcon);

    // Expect the bio textarea to be in the document
    expect(screen.getByPlaceholderText('Type your bio here')).toBeInTheDocument();
  });

  // You can add more tests to validate the behavior of other parts of the component.
});
