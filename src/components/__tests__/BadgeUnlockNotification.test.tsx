/**
 * Tests for BadgeUnlockNotification component
 */

import { render, screen, waitFor } from '@/test-utils';
import { BadgeUnlockNotification } from '@/components/BadgeUnlockNotification';

describe('BadgeUnlockNotification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render without crashing', async () => {
    const { container } = render(<BadgeUnlockNotification />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should not crash when no badges are unlocked', async () => {
    const { container } = render(<BadgeUnlockNotification />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });
  });

  it('should handle component lifecycle', async () => {
    const { unmount } = render(<BadgeUnlockNotification />);

    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });

    // Component should unmount cleanly
    unmount();
    expect(document.body).toBeInTheDocument();
  });
});
