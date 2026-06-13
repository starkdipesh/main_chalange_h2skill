import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the main heading and description', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Mental Wellness Tracker/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your AI-powered companion for exam preparation wellness/i)
    ).toBeInTheDocument();
  });
});
