import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Joinevents from '../Back End/JoinEvents';
import '@testing-library/jest-dom';


describe('<Joinevents />', () => {
  it('renders without crashing', async () => {
    await render(
      <MemoryRouter>
        <Joinevents />
      </MemoryRouter>
    );

    expect(screen.getByText('Join an Event')).toBeInTheDocument();
  });


  // Add more test cases as needed
});
