import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    indeterminate: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Checkbox Label',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Checkbox',
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Checkbox with Helper Text',
    helperText: 'This is helpful information',
  },
};

export const Error: Story = {
  args: {
    label: 'Error Checkbox',
    error: true,
    helperText: 'This field has an error',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate Checkbox',
    indeterminate: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small Checkbox',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium Checkbox',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large Checkbox',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: 'Full Width Checkbox',
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox label="Option 1" />
      <Checkbox label="Option 2" defaultChecked />
      <Checkbox label="Option 3" />
      <Checkbox label="Option 4" disabled />
      <Checkbox label="Option 5" disabled defaultChecked />
    </div>
  ),
};
