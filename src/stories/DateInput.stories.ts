import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { DateInput } from '@react-date-range/components';

const meta: Meta<typeof DateInput> = {
  title: 'Example/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: (val: Date | undefined) => val,
  },
  args: { onChange: fn() },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: new Date(),
    onChange: fn(),
    dateDisplayFormat: 'dd/MM/yyyy',
    dateOptions: {
      weekStartsOn: 1,
    },
  },
};
