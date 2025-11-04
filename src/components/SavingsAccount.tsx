import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { formatCurrency, formatRIB } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const SavingsAccount: React.FC = () => {
  const { user, showBalance, toggleBalanceVisibility } = useApp();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('RIB copié dans le presse-papier');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Compte Épargne</div>
        <p className="text-gray-600">Consultez votre compte épargne</p>
      </div>

      <Card className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Compte Épargne</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-700"
              onClick={toggleBalanceVisibility}
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-green-200 mb-1">Solde épargne</div>
            <div className="text-3xl">
              {showBalance ? formatCurrency(user?.savingsBalance || 0) : '••••••'}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-green-200">RIB Épargne</div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-700 h-8 w-8"
                onClick={() => copyToClipboard(user?.savingsRib || '')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm font-mono bg-green-700 rounded p-2">
              {formatRIB(user?.savingsRib || '')}
            </div>
          </div>

          <div className="pt-2 border-t border-green-500">
            <div className="text-green-200 text-sm">Numéro de compte</div>
            <div className="font-mono">{user?.savingsAccountNumber}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="mb-2">💡 Conseil</div>
            <p className="text-sm text-gray-700">
              Votre compte épargne vous permet de mettre de l'argent de côté. 
              Utilisez la fonction de virement pour transférer des fonds entre vos comptes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Compte Principal</div>
              <div className="text-xl">
                {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-gray-600 text-sm mb-1">Total</div>
              <div className="text-xl">
                {showBalance 
                  ? formatCurrency((user?.balance || 0) + (user?.savingsBalance || 0))
                  : '••••••'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
