import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: 'Switch',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked switch',
    checked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Switch with helper text',
    helperText: 'This is helpful information',
    checked: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Switch with error',
    error: 'This field has an error',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked switch',
    checked: true,
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small switch',
    checked: true,
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium switch',
    checked: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large switch',
    checked: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width switch',
    fullWidth: true,
    checked: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    checked: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch size="sm" label="Small switch" checked />
      <Switch size="md" label="Medium switch" checked />
      <Switch size="lg" label="Large switch" checked />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Unchecked" />
      <Switch label="Checked" checked />
      <Switch label="Disabled unchecked" disabled />
      <Switch label="Disabled checked" checked disabled />
      <Switch label="Error state" error="This field has an error" />
    </div>
  ),
};
