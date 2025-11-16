import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  render: () => (
    <Tooltip content="This is a tooltip on top" position="top">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip content="This is a tooltip on bottom" position="bottom">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip content="This is a tooltip on left" position="left">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip content="This is a tooltip on right" position="right">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <Tooltip content="This tooltip appears after 500ms" delay={500}>
      <Button>Hover me (delayed)</Button>
    </Tooltip>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <div>
          <div className="font-semibold mb-1">Rich Tooltip</div>
          <div className="text-sm">This tooltip contains multiple lines and formatted content.</div>
        </div>
      }
    >
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tooltip content="This tooltip is disabled" disabled>
      <Button>Hover me (disabled)</Button>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip content="Click to edit">
      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        <span className="text-xl">✏️</span>
      </button>
    </Tooltip>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <Tooltip content="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <div className="flex gap-8">
        <Tooltip content="Left tooltip" position="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" position="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip content="This is a very long tooltip message that demonstrates how the tooltip handles longer content and wraps text appropriately.">
      <Button>Hover for long content</Button>
    </Tooltip>
  ),
};
