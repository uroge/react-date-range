import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Calendar } from '@react-date-range/components';

const meta: Meta<typeof Calendar> = {
  title: 'Example/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: (val: Date | undefined) => val,
  },
  args: { onChange: fn() },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onChange: fn(),
  },
};
