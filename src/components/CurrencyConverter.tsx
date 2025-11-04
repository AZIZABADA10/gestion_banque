import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeftRight } from 'lucide-react';
import { validators } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

// Taux de change statiques (peuvent être remplacés par des API externes)
const EXCHANGE_RATES = {
  MAD_TO_EUR: 0.092,
  EUR_TO_MAD: 10.87,
  MAD_TO_USD: 0.10,
  USD_TO_MAD: 10.0
};

export const CurrencyConverter: React.FC = () => {
  const { user, addTransaction, updateBalance } = useApp();
  const [fromCurrency, setFromCurrency] = useState('MAD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const getExchangeRate = (from: string, to: string): number => {
    if (from === 'MAD' && to === 'EUR') return EXCHANGE_RATES.MAD_TO_EUR;
    if (from === 'EUR' && to === 'MAD') return EXCHANGE_RATES.EUR_TO_MAD;
    if (from === 'MAD' && to === 'USD') return EXCHANGE_RATES.MAD_TO_USD;
    if (from === 'USD' && to === 'MAD') return EXCHANGE_RATES.USD_TO_MAD;
    return 1;
  };

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.amount(amount)) {
      toast.error('Montant invalide');
      return;
    }

    const sourceAmount = parseFloat(amount);
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const result = sourceAmount * rate;

    setConvertedAmount(result);
  };

  const handleConfirmConversion = () => {
    if (!convertedAmount || !amount) return;

    const sourceAmount = parseFloat(amount);

    // Vérifier si on convertit depuis MAD (nécessite un débit)
    if (fromCurrency === 'MAD') {
      if (sourceAmount > (user?.balance || 0)) {
        toast.error('Solde insuffisant');
        return;
      }

      updateBalance(-sourceAmount);
      addTransaction({
        type: 'conversion',
        amount: -sourceAmount,
        description: `Conversion ${sourceAmount.toFixed(2)} MAD → ${convertedAmount.toFixed(2)} ${toCurrency}`,
        status: 'completed'
      });
    } else {
      // Conversion vers MAD (crédit)
      updateBalance(convertedAmount);
      addTransaction({
        type: 'conversion',
        amount: convertedAmount,
        description: `Conversion ${sourceAmount.toFixed(2)} ${fromCurrency} → ${convertedAmount.toFixed(2)} MAD`,
        status: 'completed'
      });
    }

    toast.success('Conversion effectuée avec succès');
    setAmount('');
    setConvertedAmount(null);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const rate = getExchangeRate(fromCurrency, toCurrency);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Conversion de Devises</div>
        <p className="text-gray-600">Convertissez vos devises (MAD ⇄ EUR, MAD ⇄ USD)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Convertisseur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConvert} className="space-y-6">
            {/* De */}
            <div className="space-y-2">
              <Label>De</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Bouton d'échange */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Vers */}
            <div className="space-y-2">
              <Label>Vers</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={convertedAmount?.toFixed(2) || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Taux de change */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Taux de change</div>
              <div>1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</div>
              {fromCurrency === 'MAD' && (
                <div className="text-sm text-gray-600 mt-2">
                  Solde disponible: {user?.balance.toFixed(2)} MAD
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button type="submit" variant="outline">
                Calculer
              </Button>
              <Button
                type="button"
                onClick={handleConfirmConversion}
                disabled={!convertedAmount}
              >
                Confirmer la conversion
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taux de Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span>1 MAD</span>
              <span>{EXCHANGE_RATES.MAD_TO_EUR.toFixed(4)} EUR</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span>1 EUR</span>
              <span>{EXCHANGE_RATES.EUR_TO_MAD.toFixed(4)} MAD</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span>1 MAD</span>
              <span>{EXCHANGE_RATES.MAD_TO_USD.toFixed(4)} USD</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span>1 USD</span>
              <span>{EXCHANGE_RATES.USD_TO_MAD.toFixed(4)} MAD</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Taux statiques à titre indicatif. Pour des taux en temps réel, une intégration avec une API externe serait nécessaire.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
