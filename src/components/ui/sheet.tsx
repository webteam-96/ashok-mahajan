'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <SheetContext.Provider value={{ onOpenChange }}>
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          open ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => onOpenChange(false)}
        />
        {children}
      </div>
    </SheetContext.Provider>,
    document.body
  );
}

const SheetContext = React.createContext<{ onOpenChange: (open: boolean) => void }>({
  onOpenChange: () => {},
});

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
}

function SheetContent({ className, children, side = 'right', open, ...props }: SheetContentProps) {
  const { onOpenChange } = React.useContext(SheetContext);

  const sideClasses = {
    right: 'right-0 top-0 h-full w-[520px] max-w-full',
    left: 'left-0 top-0 h-full w-[520px] max-w-full',
    top: 'top-0 left-0 right-0 w-full',
    bottom: 'bottom-0 left-0 right-0 w-full',
  };

  const translateClasses = {
    right: open ? 'translate-x-0' : 'translate-x-full',
    left: open ? 'translate-x-0' : '-translate-x-full',
    top: open ? 'translate-y-0' : '-translate-y-full',
    bottom: open ? 'translate-y-0' : 'translate-y-full',
  };

  return (
    <div
      className={cn(
        'fixed z-50 bg-white border-l border-slate-200 shadow-xl',
        'transition-transform duration-300 ease-in-out',
        'flex flex-col',
        sideClasses[side],
        translateClasses[side],
        className
      )}
      {...props}
    >
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-5 border-b border-slate-200 flex flex-col space-y-1', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold text-heading leading-none', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-500', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3',
        className
      )}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-6 py-5', className)}
      {...props}
    />
  );
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetBody };
