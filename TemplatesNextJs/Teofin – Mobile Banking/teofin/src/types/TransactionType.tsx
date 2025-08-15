export type TransactionType = {
  id: number;
  to?: string;
  name: string;
  icon: string;
  date?: string;
  amount: number;
  currency?: string;
  category?: string;
  direction: 'in' | 'out';
  transactionType?: 'credit' | 'debit';
};
