import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthPage } from './components/AuthPage';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { BeneficiaryManagement } from './components/BeneficiaryManagement';
import { Transfer } from './components/Transfer';
import { BillPayment } from './components/BillPayment';
import { TelecomRecharge } from './components/TelecomRecharge';
import { CardManagement } from './components/CardManagement';
import { SavingsAccount } from './components/SavingsAccount';
import { TransactionHistory } from './components/TransactionHistory';
import { CurrencyConverter } from './components/CurrencyConverter';
import { Toaster } from './components/ui/sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'beneficiaries':
        return <BeneficiaryManagement />;
      case 'transfer':
        return <Transfer />;
      case 'bills':
        return <BillPayment />;
      case 'telecom':
        return <TelecomRecharge />;
      case 'card':
        return <CardManagement />;
      case 'savings':
        return <SavingsAccount />;
      case 'history':
        return <TransactionHistory />;
      case 'currency':
        return <CurrencyConverter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AppProvider>
  );
}
