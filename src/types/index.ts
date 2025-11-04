export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountNumber: string;
  savingsAccountNumber: string;
  balance: number;
  savingsBalance: number;
  rib: string;
  savingsRib: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  iban: string;
  bank: string;
  isBlocked: boolean;
  addedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'virement' | 'paiement' | 'recharge' | 'conversion';
  amount: number;
  date: Date;
  description: string;
  recipient?: string;
  status: 'completed' | 'pending' | 'rejected';
}

export interface Card {
  id: string;
  number: string;
  type: 'virtuelle';
  isActive: boolean;
  isBlocked: boolean;
  dailyLimit: number;
  currentDailySpent: number;
}

export interface TelecomFavorite {
  id: string;
  operator: 'inwi' | 'IAM' | 'Orange';
  phoneNumber: string;
  label: string;
}
