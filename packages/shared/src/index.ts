// ============================================================
// UzERP Shared Types and Utilities
// ============================================================

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  VIEWER = 'VIEWER',
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  inn: string;
  address?: string;
  phone?: string;
  email?: string;
  bankAccount?: string;
  mfo?: string;
  director?: string;
  accountant?: string;
}

// Account Types
export interface Account {
  id: string;
  code: string;
  name: string;
  nameRu?: string;
  type: AccountType;
  parentId?: string;
  isActive: boolean;
  organizationId: string;
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Journal Types
export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  reference?: string;
  status: JournalStatus;
  lines: JournalLine[];
  organizationId: string;
  createdById: string;
}

export interface JournalLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export enum JournalStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

// Transaction Types
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  reference?: string;
  counterpartyId?: string;
  accountId: string;
  journalEntryId?: string;
  organizationId: string;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Counterparty Types
export interface Counterparty {
  id: string;
  name: string;
  type: CounterpartyType;
  inn?: string;
  phone?: string;
  email?: string;
  address?: string;
  organizationId: string;
}

export enum CounterpartyType {
  CLIENT = 'CLIENT',
  SUPPLIER = 'SUPPLIER',
  OTHER = 'OTHER',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  profit: number;
  counterpartiesCount: number;
  employeesCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

// Constants
export const CURRENCIES = {
  UZS: { code: 'UZS', name: 'O\'zbek so\'mi', symbol: 'so\'m' },
  USD: { code: 'USD', name: 'AQSH dollari', symbol: '$' },
  EUR: { code: 'EUR', name: 'Yevro', symbol: '\u20ac' },
  RUB: { code: 'RUB', name: 'Rossiya rubli', symbol: '\u20bd' },
} as const;

export const TAX_RATES = {
  QQS: 12,        // VAT - 12%
  PROFIT: 15,     // Profit tax - 15% (standard)
  PROFIT_LARGE: 20, // Profit tax - 20% (large entities)
  NDFL: 12,       // Personal income tax - 12%
  INPS: 12,       // Social insurance - 12%
} as const;

export const UZBEKISTAN_MV = 340000; // Minimal ish haqi (2024)
