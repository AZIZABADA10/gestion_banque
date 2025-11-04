import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { validators } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const BillPayment: React.FC = () => {
  const { user, addTransaction, updateBalance } = useApp();
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.billReference(reference)) {
      toast.error('Référence invalide (6-20 caractères alphanumériques en majuscules)');
      return;
    }

    if (!validators.amount(amount)) {
      toast.error('Montant invalide');
      return;
    }

    const paymentAmount = parseFloat(amount);

    if (paymentAmount > (user?.balance || 0)) {
      toast.error('Solde insuffisant');
      return;
    }

    updateBalance(-paymentAmount);
    addTransaction({
      type: 'paiement',
      amount: -paymentAmount,
      description: `Paiement facture ${reference}`,
      status: 'completed'
    });

    toast.success('Facture payée avec succès');
    setReference('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Paiement de Factures</div>
        <p className="text-gray-600">Payez vos factures en quelques clics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Facture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Référence de la facture</Label>
              <Input
                id="reference"
                placeholder="ABC123456"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                required
              />
              <p className="text-sm text-gray-500">
                Format: 6-20 caractères alphanumériques en majuscules
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (MAD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Solde disponible:</span>
                <span>{user?.balance.toFixed(2)} MAD</span>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Payer la facture
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
