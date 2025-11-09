"use client";

import { ReactNode } from 'react';
import { cn } from '@/utils';
import { Container } from './Container';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  className,
  containerSize = 'lg'
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 py-8', className)}>
      <Container size={containerSize}>
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
}
