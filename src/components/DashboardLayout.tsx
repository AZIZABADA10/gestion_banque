import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Home,
  Users,
  Send,
  Receipt,
  Smartphone,
  CreditCard,
  PiggyBank,
  History,
  DollarSign,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage,
  setCurrentPage
}) => {
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'beneficiaries', label: 'Bénéficiaires', icon: Users },
    { id: 'transfer', label: 'Virements', icon: Send },
    { id: 'bills', label: 'Factures', icon: Receipt },
    { id: 'telecom', label: 'Recharges', icon: Smartphone },
    { id: 'card', label: 'Ma Carte', icon: CreditCard },
    { id: 'savings', label: 'Compte Épargne', icon: PiggyBank },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'currency', label: 'Devises', icon: DollarSign }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Bienvenue</div>
              <div>{user?.firstName} {user?.lastName}</div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Bienvenue</div>
            <div>{user?.firstName} {user?.lastName}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
