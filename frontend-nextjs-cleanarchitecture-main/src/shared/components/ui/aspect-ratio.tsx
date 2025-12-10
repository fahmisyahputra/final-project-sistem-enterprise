'use client';

import * as React from 'react';

import { cn } from '@/core/utils';

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  children: React.ReactNode;
}

export function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ paddingBottom: `${100 / ratio}%`, ...style }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
