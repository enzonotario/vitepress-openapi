import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Checkbox } from './Checkbox.vue'

export const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=unchecked]:bg-white data-[state=unchecked]:border-solid data-[state=unchecked]:dark:bg-gray-600',
        toggle: 'border-solid',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
