import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatPanel from './ChatPanel';

test('renders chat companion header and initial welcome message', () => {
  render(<ChatPanel />);

  expect(
    screen.getByRole('heading', { name: /Wellness Companion Chat/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/I'm your Empathetic Digital Companion/i)
  ).toBeInTheDocument();
});
