/**
 * Tests for LoadingSkeleton components
 */

import { render } from '@/test-utils';
import {
  StatsCardSkeleton,
  ActivityListSkeleton,
  BadgeCardSkeleton,
  ChallengeCardSkeleton,
} from '@/components/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  describe('StatsCardSkeleton', () => {
    it('should render stats card skeleton', () => {
      const { container } = render(<StatsCardSkeleton />);
      expect(container).toBeInTheDocument();
    });

    it('should have skeleton animation class', () => {
      const { container } = render(<StatsCardSkeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('ActivityListSkeleton', () => {
    it('should render activity list skeleton', () => {
      const { container } = render(<ActivityListSkeleton />);
      expect(container).toBeInTheDocument();
    });

    it('should have skeleton animation class', () => {
      const { container } = render(<ActivityListSkeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('ChallengeCardSkeleton', () => {
    it('should render challenge card skeleton', () => {
      const { container } = render(<ChallengeCardSkeleton />);
      expect(container).toBeInTheDocument();
    });

    it('should have skeleton animation class', () => {
      const { container } = render(<ChallengeCardSkeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });

  describe('BadgeCardSkeleton', () => {
    it('should render badge card skeleton', () => {
      const { container } = render(<BadgeCardSkeleton />);
      expect(container).toBeInTheDocument();
    });

    it('should have skeleton animation class', () => {
      const { container } = render(<BadgeCardSkeleton />);
      const skeleton = container.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
