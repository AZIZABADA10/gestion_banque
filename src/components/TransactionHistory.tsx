import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { formatCurrency } from '../utils/validators';
import { Send, Receipt, Smartphone, DollarSign } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'virement':
        return <Send className="w-5 h-5" />;
      case 'paiement':
        return <Receipt className="w-5 h-5" />;
      case 'recharge':
        return <Smartphone className="w-5 h-5" />;
      case 'conversion':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Receipt className="w-5 h-5" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'virement':
        return 'Virement';
      case 'paiement':
        return 'Paiement';
      case 'recharge':
        return 'Recharge';
      case 'conversion':
        return 'Conversion';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2">Historique des Transactions</div>
        <p className="text-gray-600">Consultez toutes vos opérations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune transaction</p>
          ) : (
            <>
              <div className="space-y-3">
                {currentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-3 rounded-lg ${
                      transaction.status === 'completed'
                        ? 'bg-blue-100 text-blue-600'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="truncate">{transaction.description}</span>
                        <Badge
                          variant={
                            transaction.type === 'virement'
                              ? 'default'
                              : transaction.type === 'paiement'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {getTransactionLabel(transaction.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        {transaction.recipient && (
                          <>
                            <span>•</span>
                            <span className="truncate">{transaction.recipient}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`text-right ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        <div>
                          {transaction.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
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
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
