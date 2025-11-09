"use client";

import { ReactNode } from 'react';
import { cn } from '@/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Section({ children, className, title, subtitle }: SectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
