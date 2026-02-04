'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500':
              variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500':
              variant === 'secondary',
            'border-2 border-sky-600 text-sky-600 hover:bg-sky-50 focus-visible:ring-sky-500':
              variant === 'outline',
          },
          {
            'h-9 px-4 text-sm rounded-md': size === 'sm',
            'h-11 px-6 text-base rounded-lg': size === 'md',
            'h-14 px-8 text-lg rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
