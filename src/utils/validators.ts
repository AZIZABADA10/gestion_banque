// Validations Regex systématiques
export const validators = {
  email: (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  },

  password: (password: string): boolean => {
    // Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },

  iban: (iban: string): boolean => {
    // Format IBAN marocain simplifié
    const regex = /^MA\d{2}[A-Z0-9]{20,30}$/;
    return regex.test(iban.replace(/\s/g, ''));
  },

  phoneNumber: (phone: string): boolean => {
    // Format marocain: 06, 07, 05 + 8 chiffres
    const regex = /^(06|07|05)\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  amount: (amount: string): boolean => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(amount) && parseFloat(amount) > 0;
  },

  billReference: (ref: string): boolean => {
    // Référence facture alphanumérique 6-20 caractères
    const regex = /^[A-Z0-9]{6,20}$/;
    return regex.test(ref);
  },

  name: (name: string): boolean => {
    // Nom avec lettres, espaces, tirets
    const regex = /^[a-zA-ZÀ-ÿ\s-]{2,50}$/;
    return regex.test(name);
  }
};

export const generateRIB = (accountNumber: string): string => {
  // Format RIB marocain: 24 chiffres
  const bankCode = '230';
  const branchCode = '80010';
  const accountNum = accountNumber.padStart(14, '0');
  const key = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${bankCode}${branchCode}${accountNum}${key}`;
};

export const generateAccountNumber = (): string => {
  return Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

export const formatRIB = (rib: string): string => {
  return rib.match(/.{1,4}/g)?.join(' ') || rib;
};

export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency === 'MAD' ? 'MAD' : currency,
    minimumFractionDigits: 2
  }).format(amount);
};
