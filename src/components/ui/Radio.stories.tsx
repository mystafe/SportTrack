import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
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
    fullWidth: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: 'Radio option',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked radio',
    checked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Radio with helper text',
    helperText: 'This is helpful information',
  },
};

export const Error: Story = {
  args: {
    label: 'Radio with error',
    error: 'This field has an error',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled radio',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small radio',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium radio',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large radio',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width radio',
    fullWidth: true,
  },
};

export const RadioGroupVertical: Story = {
  render: () => (
    <RadioGroup
      name="example-vertical"
      label="Choose an option"
      helperText="Select one option from the list"
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3', disabled: true },
      ]}
    />
  ),
};

export const RadioGroupHorizontal: Story = {
  render: () => (
    <RadioGroup
      name="example-horizontal"
      label="Choose an option"
      orientation="horizontal"
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
    />
  ),
};

export const RadioGroupWithError: Story = {
  render: () => (
    <RadioGroup
      name="example-error"
      label="Choose an option"
      error="Please select an option"
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
    />
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Radio size="sm" label="Small radio" />
      <Radio size="md" label="Medium radio" />
      <Radio size="lg" label="Large radio" />
    </div>
  ),
};
