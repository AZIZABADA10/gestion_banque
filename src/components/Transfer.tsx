import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { validators } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const Transfer: React.FC = () => {
  const { user, beneficiaries, card, addTransaction, updateBalance } = useApp();
  const [transferType, setTransferType] = useState<'beneficiary' | 'savings'>('beneficiary');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const activeBeneficiaries = beneficiaries.filter(b => !b.isBlocked);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation du montant
    if (!validators.amount(amount)) {
      toast.error('Montant invalide');
      return;
    }

    const transferAmount = parseFloat(amount);

    // Vérifier le solde
    if (transferAmount > (user?.balance || 0)) {
      toast.error('Solde insuffisant');
      return;
    }

    // Vérifier le plafond de la carte
    if (card && !card.isBlocked && card.isActive) {
      if (transferAmount + (card.currentDailySpent || 0) > card.dailyLimit) {
        toast.error(`Plafond journalier dépassé (${card.dailyLimit} MAD maximum)`);
        addTransaction({
          type: 'virement',
          amount: -transferAmount,
          description: description || 'Virement',
          status: 'rejected'
        });
        return;
      }
    }

    // Vérifier si la carte est bloquée
    if (card?.isBlocked) {
      toast.error('Opération refusée : carte bloquée');
      addTransaction({
        type: 'virement',
        amount: -transferAmount,
        description: description || 'Virement',
        status: 'rejected'
      });
      return;
    }

    // Effectuer le virement
    if (transferType === 'beneficiary') {
      if (!selectedBeneficiary) {
        toast.error('Veuillez sélectionner un bénéficiaire');
        return;
      }

      const beneficiary = beneficiaries.find(b => b.id === selectedBeneficiary);
      if (beneficiary?.isBlocked) {
        toast.error('Ce bénéficiaire est bloqué');
        return;
      }

      updateBalance(-transferAmount);
      addTransaction({
        type: 'virement',
        amount: -transferAmount,
        description: `Virement vers ${beneficiary?.name}`,
        recipient: beneficiary?.name,
        status: 'completed'
      });
      toast.success('Virement effectué avec succès');
    } else {
      // Virement vers épargne
      updateBalance(-transferAmount);
      updateBalance(transferAmount, true);
      addTransaction({
        type: 'virement',
        amount: -transferAmount,
        description: 'Virement vers compte épargne',
        status: 'completed'
      });
      toast.success('Virement vers épargne effectué');
    }

    setAmount('');
    setDescription('');
    setSelectedBeneficiary('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Virements</div>
        <p className="text-gray-600">Effectuez des virements vers vos bénéficiaires ou votre compte épargne</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouveau Virement</CardTitle>
        </CardHeader>
        <CardContent>
          {card?.isBlocked && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Votre carte est actuellement bloquée. Les virements seront refusés.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={transferType} onValueChange={(v) => setTransferType(v as 'beneficiary' | 'savings')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="beneficiary">Vers bénéficiaire</TabsTrigger>
              <TabsTrigger value="savings">Vers épargne</TabsTrigger>
            </TabsList>

            <TabsContent value="beneficiary">
              <form onSubmit={handleTransfer} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Bénéficiaire</Label>
                  <Select value={selectedBeneficiary} onValueChange={setSelectedBeneficiary}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bénéficiaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeBeneficiaries.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Aucun bénéficiaire disponible
                        </div>
                      ) : (
                        activeBeneficiaries.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name} - {b.bank}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Input
                    id="description"
                    placeholder="Paiement facture, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Solde disponible:</span>
                    <span>{user?.balance.toFixed(2)} MAD</span>
                  </div>
                  {card && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Plafond journalier restant:</span>
                      <span>{(card.dailyLimit - (card.currentDailySpent || 0)).toFixed(2)} MAD</span>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={activeBeneficiaries.length === 0}>
                  Effectuer le virement
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="savings">
              <form onSubmit={handleTransfer} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="savings-amount">Montant (MAD)</Label>
                  <Input
                    id="savings-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Solde compte principal:</span>
                    <span>{user?.balance.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Solde compte épargne:</span>
                    <span>{user?.savingsBalance.toFixed(2)} MAD</span>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Transférer vers épargne
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
