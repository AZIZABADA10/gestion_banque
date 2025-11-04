import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { CreditCard, Lock, Unlock, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const CardManagement: React.FC = () => {
  const { card, updateCardStatus, updateCardLimit } = useApp();
  const [tempLimit, setTempLimit] = useState(card?.dailyLimit || 5000);

  if (!card) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune carte disponible</p>
      </div>
    );
  }

  const handleActivation = (isActive: boolean) => {
    updateCardStatus(isActive, card.isBlocked);
    toast.success(isActive ? 'Carte activée' : 'Carte désactivée');
  };

  const handleBlock = (isBlocked: boolean) => {
    updateCardStatus(card.isActive, isBlocked);
    toast.success(isBlocked ? 'Carte bloquée' : 'Carte débloquée');
  };

  const handleLimitUpdate = () => {
    if (tempLimit < 100 || tempLimit > 50000) {
      toast.error('Le plafond doit être entre 100 et 50 000 MAD');
      return;
    }
    updateCardLimit(tempLimit);
    toast.success('Plafond mis à jour');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Ma Carte Bancaire</div>
        <p className="text-gray-600">Gérez et contrôlez votre carte virtuelle</p>
      </div>

      {/* Carte virtuelle */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-400 mb-1">Carte Virtuelle</div>
                <div className="flex items-center gap-2">
                  {card.isActive ? (
                    <Badge className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-600">Inactive</Badge>
                  )}
                  {card.isBlocked && (
                    <Badge className="bg-red-600">Bloquée</Badge>
                  )}
                </div>
              </div>
              <CreditCard className="w-12 h-12 text-gray-400" />
            </div>

            <div className="text-2xl font-mono tracking-wider">
              {card.number}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-gray-400 text-sm">Type</div>
                <div className="capitalize">{card.type}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm">Plafond journalier</div>
                <div>{card.dailyLimit.toFixed(2)} MAD</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle>Contrôles de la carte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activation */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {card.isActive ? (
                <div className="bg-green-100 p-2 rounded-lg">
                  <Power className="w-5 h-5 text-green-600" />
                </div>
              ) : (
                <div className="bg-gray-200 p-2 rounded-lg">
                  <PowerOff className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div>
                <div>Activation de la carte</div>
                <div className="text-sm text-gray-600">
                  {card.isActive ? 'Carte active et utilisable' : 'Carte désactivée'}
                </div>
              </div>
            </div>
            <Switch
              checked={card.isActive}
              onCheckedChange={handleActivation}
            />
          </div>

          {/* Blocage */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {card.isBlocked ? (
                <div className="bg-red-100 p-2 rounded-lg">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
              ) : (
                <div className="bg-green-100 p-2 rounded-lg">
                  <Unlock className="w-5 h-5 text-green-600" />
                </div>
              )}
              <div>
                <div>Blocage de la carte</div>
                <div className="text-sm text-gray-600">
                  {card.isBlocked ? 'Toutes les opérations sont bloquées' : 'Carte débloquée'}
                </div>
              </div>
            </div>
            <Switch
              checked={card.isBlocked}
              onCheckedChange={handleBlock}
            />
          </div>

          {/* Plafond */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="mb-2">Plafond journalier</div>
              <div className="text-sm text-gray-600 mb-4">
                Dépensé aujourd'hui: {card.currentDailySpent.toFixed(2)} / {card.dailyLimit.toFixed(2)} MAD
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit-slider">Nouveau plafond: {tempLimit} MAD</Label>
              <Slider
                id="limit-slider"
                min={100}
                max={50000}
                step={100}
                value={[tempLimit]}
                onValueChange={(value) => setTempLimit(value[0])}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>100 MAD</span>
                <span>50 000 MAD</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1000, 2500, 5000, 10000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTempLimit(amount)}
                >
                  {amount}
                </Button>
              ))}
            </div>

            <Button onClick={handleLimitUpdate} className="w-full">
              Mettre à jour le plafond
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Utilisation */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Montant dépensé</span>
              <span>{card.currentDailySpent.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plafond restant</span>
              <span>{(card.dailyLimit - card.currentDailySpent).toFixed(2)} MAD</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((card.currentDailySpent / card.dailyLimit) * 100, 100)}%`
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
