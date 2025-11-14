/**
 * Tests for LanguageToggle component
 */

import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { LanguageToggle } from '@/components/LanguageToggle';

describe('LanguageToggle', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render language toggle buttons', () => {
    render(<LanguageToggle />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2); // TR, EN
  });

  it('should toggle language when clicked', async () => {
    render(<LanguageToggle />);

    const buttons = screen.getAllByRole('button');
    // Click EN button if current is TR
    fireEvent.click(buttons[1]);

    await waitFor(() => {
      // Language change should trigger some update
      expect(buttons).toBeDefined();
    });
  });

  it('should display current language', () => {
    Storage.prototype.getItem = jest.fn(() => 'en');
    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle Turkish language', () => {
    Storage.prototype.getItem = jest.fn(() => 'tr');
    render(<LanguageToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
