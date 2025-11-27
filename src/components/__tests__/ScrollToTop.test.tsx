import { render } from '@/test-utils';
import { ScrollToTop } from '../ScrollToTop';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

describe('ScrollToTop', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('renders scroll to top button', () => {
    const { container } = render(<ScrollToTop />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('scrolls to top when button is clicked', () => {
    const { container } = render(<ScrollToTop />);
    const button = container.querySelector('button');

    if (button) {
      button.click();
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    }
  });
});
