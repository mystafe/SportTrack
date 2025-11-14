/**
 * Tests for LevelDisplay component
 */

import { render, screen, waitFor } from '@/test-utils';
import { LevelDisplay } from '@/components/LevelDisplay';

describe('LevelDisplay', () => {
  it('should render component without crashing', () => {
    const { container } = render(<LevelDisplay />);
    expect(container).toBeInTheDocument();
  });

  it('should render component structure', () => {
    const { container } = render(<LevelDisplay />);
    // Component should render something
    expect(container.firstChild).toBeInTheDocument();
  });
}, 10000);
