import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}

const variantClasses: Record<string, string> = {
  default: 'bg-primary text-heading',
  secondary: 'bg-slate-100 text-slate-600',
  outline: 'border border-slate-200 text-slate-600 bg-transparent',
  destructive: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700 border border-green-200',
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
