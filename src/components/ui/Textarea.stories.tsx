import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
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
    rows: {
      control: 'number',
    },
    error: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Description',
    helperText: 'Please provide a detailed description',
    placeholder: 'Enter description...',
  },
};

export const Error: Story = {
  args: {
    label: 'Description',
    error: 'This field is required',
    placeholder: 'Enter description...',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled textarea',
    disabled: true,
    defaultValue: 'This textarea is disabled',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small textarea',
    placeholder: 'Enter text...',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    label: 'Medium textarea',
    placeholder: 'Enter text...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large textarea',
    placeholder: 'Enter text...',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width textarea',
    fullWidth: true,
    placeholder: 'Enter text...',
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Custom rows',
    rows: 5,
    placeholder: 'Enter text...',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Description',
    defaultValue: 'This is a sample text that demonstrates how the textarea looks with content.',
    placeholder: 'Enter description...',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Textarea size="sm" label="Small" placeholder="Enter text..." />
      <Textarea size="md" label="Medium" placeholder="Enter text..." />
      <Textarea size="lg" label="Large" placeholder="Enter text..." />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <Textarea label="Default" placeholder="Enter text..." />
      <Textarea
        label="With helper text"
        helperText="This is helpful information"
        placeholder="Enter text..."
      />
      <Textarea label="Error state" error="This field is required" placeholder="Enter text..." />
      <Textarea label="Disabled" disabled defaultValue="This textarea is disabled" />
    </div>
  ),
};
