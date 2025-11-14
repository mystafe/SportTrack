/**
 * Tests for ThemeToggle component
 */

import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render theme toggle buttons', () => {
    render(<ThemeToggle />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3); // Light, System, Dark
  });

  it('should toggle theme when clicked', async () => {
    render(<ThemeToggle />);

    const buttons = screen.getAllByRole('button');
    // Click light theme button
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should display current theme', () => {
    Storage.prototype.getItem = jest.fn(() => 'dark');
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle system theme', () => {
    Storage.prototype.getItem = jest.fn(() => 'system');
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
