import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Copy, Download } from 'lucide-react';
import { formatCurrency, formatRIB } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const Dashboard: React.FC = () => {
  const { user, showBalance, toggleBalanceVisibility, transactions } = useApp();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier`);
  };

  const exportRIBtoPDF = () => {
    toast.success('RIB exporté en PDF (fonctionnalité simulée)');
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Tableau de bord</div>
        <p className="text-gray-600">Vue d'ensemble de vos comptes</p>
      </div>

      {/* Compte Principal */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Compte Principal</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={toggleBalanceVisibility}
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-blue-200 mb-1">Solde disponible</div>
            <div className="text-3xl">
              {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-blue-200">RIB</div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-700 h-8 w-8"
                  onClick={() => copyToClipboard(user?.rib || '', 'RIB')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-700 h-8 w-8"
                  onClick={exportRIBtoPDF}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm font-mono bg-blue-700 rounded p-2">
              {formatRIB(user?.rib || '')}
            </div>
          </div>

          <div className="pt-2 border-t border-blue-500">
            <div className="text-blue-200 text-sm">Numéro de compte</div>
            <div className="font-mono">{user?.accountNumber}</div>
          </div>
        </CardContent>
      </Card>

      {/* Compte Épargne */}
      <Card>
        <CardHeader>
          <CardTitle>Compte Épargne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-gray-600 mb-1">Solde</div>
            <div className="text-2xl">
              {showBalance ? formatCurrency(user?.savingsBalance || 0) : '••••••'}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">RIB Épargne</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(user?.savingsRib || '', 'RIB Épargne')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm font-mono bg-gray-100 rounded p-2">
              {formatRIB(user?.savingsRib || '')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transaction</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{transaction.description}</span>
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'default'
                            : transaction.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {transaction.status === 'completed'
                          ? 'Complété'
                          : transaction.status === 'pending'
                          ? 'En cours'
                          : 'Rejeté'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                    {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
