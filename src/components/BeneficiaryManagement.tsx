import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, Trash2, Lock, Unlock } from 'lucide-react';
import { validators } from '../utils/validators';
import { toast } from 'sonner@2.0.3';

export const BeneficiaryManagement: React.FC = () => {
  const { beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    iban: '',
    bank: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validators.name(formData.name)) {
      toast.error('Format de nom invalide');
      return;
    }

    if (!validators.iban(formData.iban)) {
      toast.error('Format IBAN invalide (ex: MA64 suivi de 20-30 caractères alphanumériques)');
      return;
    }

    if (!formData.bank.trim()) {
      toast.error('Nom de banque requis');
      return;
    }

    addBeneficiary({
      name: formData.name,
      iban: formData.iban.replace(/\s/g, ''),
      bank: formData.bank,
      isBlocked: false
    });

    toast.success('Bénéficiaire ajouté avec succès');
    setFormData({ name: '', iban: '', bank: '' });
    setDialogOpen(false);
  };

  const toggleBlockStatus = (id: string, currentStatus: boolean) => {
    updateBeneficiary(id, { isBlocked: !currentStatus });
    toast.success(currentStatus ? 'Bénéficiaire débloqué' : 'Bénéficiaire bloqué');
  };

  const confirmDelete = (id: string) => {
    setBeneficiaryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (beneficiaryToDelete) {
      deleteBeneficiary(beneficiaryToDelete);
      toast.success('Bénéficiaire supprimé');
      setDeleteDialogOpen(false);
      setBeneficiaryToDelete(null);
    }
  };

  const filteredAndSorted = beneficiaries
    .filter(b =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bank.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'bank') return a.bank.localeCompare(b.bank);
      if (sortBy === 'date') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      return 0;
    });

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Gestion des Bénéficiaires</div>
        <p className="text-gray-600">Ajoutez et gérez vos bénéficiaires</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Mes Bénéficiaires</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un bénéficiaire
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau Bénéficiaire</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      placeholder="Ahmed Benali"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      placeholder="MA64 XXXX XXXX XXXX XXXX XXXX XXXX"
                      value={formData.iban}
                      onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank">Nom de la banque</Label>
                    <Input
                      id="bank"
                      placeholder="Attijariwafa Bank"
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      required
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
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un bénéficiaire..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="bank">Banque</SelectItem>
                <SelectItem value="date">Date d'ajout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredAndSorted.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'Aucun bénéficiaire trouvé' : 'Aucun bénéficiaire ajouté'}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredAndSorted.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{beneficiary.name}</span>
                        {beneficiary.isBlocked && (
                          <Badge variant="destructive">Bloqué</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{beneficiary.bank}</div>
                      <div className="text-sm font-mono text-gray-500 mt-1">
                        {beneficiary.iban}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleBlockStatus(beneficiary.id, beneficiary.isBlocked)}
                      >
                        {beneficiary.isBlocked ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => confirmDelete(beneficiary.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bénéficiaire ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
