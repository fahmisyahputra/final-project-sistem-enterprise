/**
 * Common Types
 * Type definitions yang digunakan di seluruh aplikasi
 */

import { ReactNode } from 'react';

// Base Props untuk components
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// Select Option
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Status
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Date Range
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Sort
export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

// Table Column Definition
export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
}
