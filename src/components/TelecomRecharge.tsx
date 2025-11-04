import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { validators } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const TelecomRecharge: React.FC = () => {
  const { user, telecomFavorites, addTelecomFavorite, deleteTelecomFavorite, addTransaction, updateBalance } = useApp();
  const [operator, setOperator] = useState<'inwi' | 'IAM' | 'Orange' | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteLabel, setFavoriteLabel] = useState('');
  const [favoriteOperator, setFavoriteOperator] = useState<'inwi' | 'IAM' | 'Orange' | ''>('');
  const [favoritePhone, setFavoritePhone] = useState('');

  const rechargeAmounts = [10, 20, 50, 100, 200];

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();

    if (!operator) {
      toast.error('Veuillez sélectionner un opérateur');
      return;
    }

    if (!validators.phoneNumber(phoneNumber)) {
      toast.error('Numéro de téléphone invalide (format: 06/07/05 + 8 chiffres)');
      return;
    }

    if (!validators.amount(amount)) {
      toast.error('Montant invalide');
      return;
    }

    const rechargeAmount = parseFloat(amount);

    if (rechargeAmount > (user?.balance || 0)) {
      toast.error('Solde insuffisant');
      return;
    }

    updateBalance(-rechargeAmount);
    addTransaction({
      type: 'recharge',
      amount: -rechargeAmount,
      description: `Recharge ${operator} - ${phoneNumber}`,
      status: 'completed'
    });

    toast.success(`Recharge ${operator} effectuée avec succès`);
    setOperator('');
    setPhoneNumber('');
    setAmount('');
  };

  const handleAddFavorite = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.phoneNumber(favoritePhone)) {
      toast.error('Numéro de téléphone invalide');
      return;
    }

    if (!favoriteOperator) {
      toast.error('Opérateur requis');
      return;
    }

    const success = addTelecomFavorite({
      operator: favoriteOperator as 'inwi' | 'IAM' | 'Orange',
      phoneNumber: favoritePhone,
      label: favoriteLabel || favoritePhone
    });

    if (success) {
      toast.success('Favori ajouté');
      setFavoriteLabel('');
      setFavoriteOperator('');
      setFavoritePhone('');
      setDialogOpen(false);
    } else {
      toast.error('Ce numéro existe déjà dans vos favoris');
    }
  };

  const useFavorite = (favorite: any) => {
    setOperator(favorite.operator);
    setPhoneNumber(favorite.phoneNumber);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Recharges Télécom</div>
        <p className="text-gray-600">Rechargez vos lignes inwi, IAM, Orange</p>
      </div>

      {/* Favoris */}
      {telecomFavorites.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Numéros Favoris</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un favori</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFavorite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fav-operator">Opérateur</Label>
                      <Select value={favoriteOperator} onValueChange={(v) => setFavoriteOperator(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inwi">inwi</SelectItem>
                          <SelectItem value="IAM">IAM (Maroc Telecom)</SelectItem>
                          <SelectItem value="Orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fav-phone">Numéro de téléphone</Label>
                      <Input
                        id="fav-phone"
                        placeholder="0612345678"
                        value={favoritePhone}
                        onChange={(e) => setFavoritePhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fav-label">Libellé (optionnel)</Label>
                      <Input
                        id="fav-label"
                        placeholder="Mon téléphone"
                        value={favoriteLabel}
                        onChange={(e) => setFavoriteLabel(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Ajouter
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {telecomFavorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => useFavorite(favorite)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{favorite.label}</span>
                      <Badge variant="outline">{favorite.operator}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">{favorite.phoneNumber}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTelecomFavorite(favorite.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulaire de recharge */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Recharge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRecharge} className="space-y-4">
            <div className="space-y-2">
              <Label>Opérateur</Label>
              <Select value={operator} onValueChange={(v) => setOperator(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un opérateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inwi">inwi</SelectItem>
                  <SelectItem value="IAM">IAM (Maroc Telecom)</SelectItem>
                  <SelectItem value="Orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                placeholder="0612345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">Format: 06/07/05 + 8 chiffres</p>
            </div>

            <div className="space-y-2">
              <Label>Montant rapide (MAD)</Label>
              <div className="grid grid-cols-5 gap-2">
                {rechargeAmounts.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant={amount === amt.toString() ? 'default' : 'outline'}
                    onClick={() => setAmount(amt.toString())}
                  >
                    {amt}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Ou montant personnalisé</Label>
              <Input
                id="custom-amount"
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
              Recharger
            </Button>
          </form>
        </CardContent>
      </Card>

      {telecomFavorites.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Aucun numéro favori enregistré</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un favori
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un favori</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFavorite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fav-operator-2">Opérateur</Label>
                      <Select value={favoriteOperator} onValueChange={(v) => setFavoriteOperator(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inwi">inwi</SelectItem>
                          <SelectItem value="IAM">IAM (Maroc Telecom)</SelectItem>
                          <SelectItem value="Orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fav-phone-2">Numéro de téléphone</Label>
                      <Input
                        id="fav-phone-2"
                        placeholder="0612345678"
                        value={favoritePhone}
                        onChange={(e) => setFavoritePhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fav-label-2">Libellé (optionnel)</Label>
                      <Input
                        id="fav-label-2"
                        placeholder="Mon téléphone"
                        value={favoriteLabel}
                        onChange={(e) => setFavoriteLabel(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Ajouter
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
