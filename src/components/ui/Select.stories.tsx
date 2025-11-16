import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
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
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    options,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Choose Option',
    options,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Choose Option',
    options,
    helperText: 'Please select an option from the list',
  },
};

export const Error: Story = {
  args: {
    label: 'Choose Option',
    options,
    error: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options,
    disabled: true,
    defaultValue: 'option1',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small Select',
    options,
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium Select',
    options,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large Select',
    options,
  },
};

export const ManyOptions: Story = {
  args: {
    label: 'Many Options',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `Option ${i + 1}`,
    })),
  },
};
