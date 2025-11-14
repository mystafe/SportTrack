import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { QuickAdd } from '../QuickAdd';
import { ActivitiesProvider } from '@/lib/activityStore';
import { SettingsProvider } from '@/lib/settingsStore';
import { I18nProvider } from '@/lib/i18n';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nProvider>
    <SettingsProvider>
      <ActivitiesProvider>{children}</ActivitiesProvider>
    </SettingsProvider>
  </I18nProvider>
);

describe('QuickAdd', () => {
  it('renders quick add buttons', () => {
    render(
      <Wrapper>
        <QuickAdd />
      </Wrapper>
    );

    expect(screen.getByText(/walking/i)).toBeInTheDocument();
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });

  it('shows activity form when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <QuickAdd />
      </Wrapper>
    );

    const walkingButton = screen.getByText(/walking/i).closest('button');
    expect(walkingButton).toBeInTheDocument();

    if (walkingButton) {
      await user.click(walkingButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      });
    }
  });
});
