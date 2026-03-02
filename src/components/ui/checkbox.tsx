'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    }

    return (
      <input
        type="checkbox"
        ref={ref}
        onChange={handleChange}
        className={cn(
          'h-4 w-4 rounded border border-slate-300 text-primary',
          'focus:ring-2 focus:ring-primary/40 cursor-pointer accent-primary',
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
