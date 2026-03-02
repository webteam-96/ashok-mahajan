import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-heading hover:opacity-90',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-heading',
  ghost: 'hover:bg-slate-100 text-heading',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizeClasses: Record<string, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-7 px-3 py-1 text-xs',
  lg: 'h-11 px-6 py-2.5 text-base',
  icon: 'h-9 w-9 p-0',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
