/**
 * Tests for Footer component
 */

import { render, screen } from '@/test-utils';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('should render footer with version information', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('should display version number', () => {
    render(<Footer />);

    // Should show version (e.g., v0.17.8)
    const versionPattern = /v\d+\.\d+\.\d+/;
    expect(screen.getByText(versionPattern)).toBeInTheDocument();
  });

  it('should display beta label', () => {
    render(<Footer />);

    const betaLabel = screen.getByText(/beta/i);
    expect(betaLabel).toBeInTheDocument();
  });
});
