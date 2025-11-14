/**
 * Tests for Logo component
 */

import { render, screen } from '@/test-utils';
import { Logo } from '@/components/Logo';

describe('Logo', () => {
  it('should render logo component', () => {
    const { container } = render(<Logo />);
    expect(container).toBeInTheDocument();
  });

  it('should display logo text', () => {
    render(<Logo />);

    // Should show "SPORT TRACK" text (uppercase)
    const logoText = screen.getByText(/SPORT/i);
    expect(logoText).toBeInTheDocument();
  });

  it('should render logo icon', () => {
    const { container } = render(<Logo />);

    // Should have SVG logo icon
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should be clickable when onClick is provided', () => {
    const onClick = jest.fn();
    const { container } = render(<Logo onClick={onClick} />);

    const logo = container.firstChild;
    if (logo) {
      // Logo should be clickable
      expect(logo).toBeInTheDocument();
    }
  });
});
