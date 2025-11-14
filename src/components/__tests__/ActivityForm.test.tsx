import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { ActivityForm } from '../ActivityForm';
import { createMockActivity } from '@/test-helpers';

describe('ActivityForm', () => {
  it('renders form fields correctly', () => {
    render(<ActivityForm onCreated={jest.fn()} />);

    expect(screen.getByText(/select activity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('renders with initial values when provided', () => {
    const initial = createMockActivity({
      amount: 5000,
      note: 'Test note',
    });

    render(
      <ActivityForm
        initial={{
          id: initial.id,
          activityKey: initial.activityKey,
          label: initial.label,
          labelEn: initial.labelEn,
          icon: initial.icon,
          unit: initial.unit,
          unitEn: initial.unitEn,
          multiplier: initial.multiplier,
          amount: initial.amount,
          note: initial.note || '',
          performedAt: initial.performedAt,
        }}
        onSaved={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument();
  });

  it('shows validation error when activity is not selected', async () => {
    const user = userEvent.setup();
    render(<ActivityForm onCreated={jest.fn()} />);

    // Unselect default activity by clicking it again
    const walkingButton = screen.getByLabelText(/select walking activity/i);
    await user.click(walkingButton);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '1000');

    const submitButton = screen.getByRole('button', { name: /add|save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/select.*activity/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when amount is invalid', async () => {
    const user = userEvent.setup();
    render(<ActivityForm onCreated={jest.fn()} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '0');

    const submitButton = screen.getByRole('button', { name: /add|save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });
  });
});
