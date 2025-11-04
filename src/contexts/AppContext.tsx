import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Beneficiary, Transaction, Card, TelecomFavorite } from '../types';
import { generateAccountNumber, generateRIB } from '../utils/validators';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  showBalance: boolean;
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  card: Card | null;
  telecomFavorites: TelecomFavorite[];
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => boolean;
  logout: () => void;
  toggleBalanceVisibility: () => void;
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'addedAt'>) => void;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  deleteBeneficiary: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateCardStatus: (isActive: boolean, isBlocked: boolean) => void;
  updateCardLimit: (limit: number) => void;
  addTelecomFavorite: (favorite: Omit<TelecomFavorite, 'id'>) => boolean;
  deleteTelecomFavorite: (id: string) => void;
  updateBalance: (amount: number, isSavings?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [telecomFavorites, setTelecomFavorites] = useState<TelecomFavorite[]>([]);

  const [card, setCard] = useState<Card | null>({
    id: '1',
    number: '4532 **** **** 8790',
    type: 'virtuelle',
    isActive: true,
    isBlocked: false,
    dailyLimit: 5000,
    currentDailySpent: 0
  });

  const login = (email: string, password: string): boolean => {
    // Mock login - en production, ceci serait géré par Supabase
    const accountNum = generateAccountNumber();
    const savingsAccountNum = generateAccountNumber();
    
    setUser({
      id: '1',
      email,
      firstName: 'Ahmed',
      lastName: 'Benali',
      accountNumber: accountNum,
      savingsAccountNumber: savingsAccountNum,
      balance: 15420.50,
      savingsBalance: 8500.00,
      rib: generateRIB(accountNum),
      savingsRib: generateRIB(savingsAccountNum)
    });
    setIsAuthenticated(true);
    return true;
  };

  const register = (email: string, password: string, firstName: string, lastName: string): boolean => {
    const accountNum = generateAccountNumber();
    const savingsAccountNum = generateAccountNumber();
    
    setUser({
      id: '2',
      email,
      firstName,
      lastName,
      accountNumber: accountNum,
      savingsAccountNumber: savingsAccountNum,
      balance: 0,
      savingsBalance: 0,
      rib: generateRIB(accountNum),
      savingsRib: generateRIB(savingsAccountNum)
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setBeneficiaries([]);
    setTransactions([]);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const addBeneficiary = (beneficiary: Omit<Beneficiary, 'id' | 'addedAt'>) => {
    setBeneficiaries([
      ...beneficiaries,
      {
        ...beneficiary,
        id: Date.now().toString(),
        addedAt: new Date()
      }
    ]);
  };

  const updateBeneficiary = (id: string, updates: Partial<Beneficiary>) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions([
      {
        ...transaction,
        id: Date.now().toString(),
        date: new Date()
      },
      ...transactions
    ]);
  };

  const updateCardStatus = (isActive: boolean, isBlocked: boolean) => {
    if (card) {
      setCard({ ...card, isActive, isBlocked });
    }
  };

  const updateCardLimit = (limit: number) => {
    if (card) {
      setCard({ ...card, dailyLimit: limit });
    }
  };

  const addTelecomFavorite = (favorite: Omit<TelecomFavorite, 'id'>): boolean => {
    // Vérifier les doublons
    const isDuplicate = telecomFavorites.some(
      f => f.phoneNumber === favorite.phoneNumber
    );
    
    if (isDuplicate) {
      return false;
    }

    setTelecomFavorites([
      ...telecomFavorites,
      {
        ...favorite,
        id: Date.now().toString()
      }
    ]);
    return true;
  };

  const deleteTelecomFavorite = (id: string) => {
    setTelecomFavorites(telecomFavorites.filter(f => f.id !== id));
  };

  const updateBalance = (amount: number, isSavings: boolean = false) => {
    if (user) {
      if (isSavings) {
        setUser({ ...user, savingsBalance: user.savingsBalance + amount });
      } else {
        setUser({ ...user, balance: user.balance + amount });
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        showBalance,
        beneficiaries,
        transactions,
        card,
        telecomFavorites,
        login,
        register,
        logout,
        toggleBalanceVisibility,
        addBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        addTransaction,
        updateCardStatus,
        updateCardLimit,
        addTelecomFavorite,
        deleteTelecomFavorite,
        updateBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
