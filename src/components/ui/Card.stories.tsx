import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    hoverable: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: 'This is a default card with some content.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'This is an elevated card with more shadow.',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'This is an outlined card with a border.',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'This is a filled card with background color.',
  },
};

export const WithHeader: Story = {
  args: {
    header: 'Card Header',
    children: 'This card has a header section.',
  },
};

export const WithFooter: Story = {
  args: {
    footer: 'Card Footer',
    children: 'This card has a footer section.',
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: 'Card Title',
    footer: 'Card Footer',
    children: 'This card has both header and footer sections.',
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: 'Hover over this card to see the effect.',
  },
};

export const Clickable: Story = {
  args: {
    clickable: true,
    onClick: () => alert('Card clicked!'),
    children: 'Click this card to trigger an action.',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'This is a small card.',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'This is a medium card.',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'This is a large card.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <Card variant="default">Default Card</Card>
      <Card variant="elevated">Elevated Card</Card>
      <Card variant="outlined">Outlined Card</Card>
      <Card variant="filled">Filled Card</Card>
    </div>
  ),
};
