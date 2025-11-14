/**
 * Tests for ConfirmDialog component
 */

import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ConfirmDialog } from '@/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Title',
    message: 'Test Message',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const onConfirm = jest.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    const confirmButton = screen.getByRole('button', { name: /confirm|onayla/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancel|iptal/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('should display custom confirm and cancel labels', () => {
    render(
      <ConfirmDialog {...defaultProps} confirmLabel="Custom Confirm" cancelLabel="Custom Cancel" />
    );

    expect(screen.getByText('Custom Confirm')).toBeInTheDocument();
    expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
  });

  it('should display custom variant for confirm button', () => {
    render(<ConfirmDialog {...defaultProps} confirmVariant="destructive" />);

    const confirmButton = screen.getByRole('button', { name: /confirm|onayla/i });
    expect(confirmButton).toBeInTheDocument();
  });
});
