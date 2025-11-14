/**
 * Tests for StatsCards component
 */

import { render, waitFor } from '@/test-utils';
import { StatsCards } from '@/components/StatsCards';

// Mock notificationService
jest.mock('@/lib/notificationService', () => ({
  notificationService: {
    canNotify: jest.fn(() => false),
    showGoalCompletion: jest.fn(),
  },
}));

describe('StatsCards', () => {
  it('should render without crashing', async () => {
    const { container } = render(<StatsCards />);

    await waitFor(
      () => {
        expect(container).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('should render component structure', async () => {
    const { container } = render(<StatsCards />);

    await waitFor(
      () => {
        // Component should have some content
        expect(container.querySelector('div')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
