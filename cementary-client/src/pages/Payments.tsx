import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Payment {
  id: number;
  paymentNumber: string;
  invoiceId: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  status: string;
  notes: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Payments: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for payments
  const [payments] = useState<Payment[]>([
    {
      id: 1,
      paymentNumber: 'PAY-2023-001',
      invoiceId: 1,
      invoiceNumber: 'INV-2023-001',
      customerId: 1,
      customerName: 'John Smith',
      paymentDate: '2023-01-20',
      amount: 3500,
      paymentMethod: 'credit_card',
      referenceNumber: 'CC-12345',
      status: 'completed',
      notes: 'Payment received in full',
    },
    {
      id: 2,
      paymentNumber: 'PAY-2023-002',
      invoiceId: 2,
      invoiceNumber: 'INV-2023-002',
      customerId: 2,
      customerName: 'Mary Johnson',
      paymentDate: '2023-02-15',
      amount: 2100,
      paymentMethod: 'bank_transfer',
      referenceNumber: 'BT-67890',
      status: 'completed',
      notes: 'Partial payment received',
    },
    {
      id: 3,
      paymentNumber: 'PAY-2023-003',
      invoiceId: 4,
      invoiceNumber: 'INV-2023-004',
      customerId: 4,
      customerName: 'Jennifer Brown',
      paymentDate: '2023-04-25',
      amount: 3000,
      paymentMethod: 'check',
      referenceNumber: 'CHK-54321',
      status: 'completed',
      notes: 'First installment',
    },
    {
      id: 4,
      paymentNumber: 'PAY-2023-004',
      invoiceId: 4,
      invoiceNumber: 'INV-2023-004',
      customerId: 4,
      customerName: 'Jennifer Brown',
      paymentDate: '2023-05-10',
      amount: 2500,
      paymentMethod: 'credit_card',
      referenceNumber: 'CC-98765',
      status: 'completed',
      notes: 'Final payment',
    },
    {
      id: 5,
      paymentNumber: 'PAY-2023-005',
      invoiceId: 5,
      invoiceNumber: 'INV-2023-005',
      customerId: 5,
      customerName: 'Michael Davis',
      paymentDate: '2023-05-15',
      amount: 1000,
      paymentMethod: 'cash',
      referenceNumber: 'CASH-11111',
      status: 'completed',
      notes: 'Deposit payment',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'paymentNumber', label: 'Payment #', minWidth: 150 },
    { id: 'invoiceNumber', label: 'Invoice #', minWidth: 150 },
    { id: 'customerName', label: 'Customer', minWidth: 180 },
    { id: 'paymentDate', label: 'Payment Date', minWidth: 120 },
    { 
      id: 'amount', 
      label: 'Amount ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { 
      id: 'paymentMethod', 
      label: 'Method', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label;
        
        switch (value) {
          case 'credit_card':
            color = theme.palette.primary.main;
            label = 'Credit Card';
            break;
          case 'bank_transfer':
            color = theme.palette.info.main;
            label = 'Bank Transfer';
            break;
          case 'check':
            color = theme.palette.warning.main;
            label = 'Check';
            break;
          case 'cash':
            color = theme.palette.success.main;
            label = 'Cash';
            break;
          default:
            color = theme.palette.secondary.main;
            label = value.charAt(0).toUpperCase() + value.slice(1);
        }
        
        return (
          <Chip 
            label={label} 
            size="small"
            sx={{ 
              bgcolor: alpha(color, 0.1),
              color: color,
              fontWeight: 'medium',
            }}
          />
        );
      }
    },
    { id: 'referenceNumber', label: 'Reference #', minWidth: 150 },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'completed':
            color = theme.palette.success.main;
            break;
          case 'pending':
            color = theme.palette.warning.main;
            break;
          case 'failed':
            color = theme.palette.error.main;
            break;
          case 'refunded':
            color = theme.palette.info.main;
            break;
          default:
            color = theme.palette.primary.main;
        }
        
        return (
          <Chip 
            label={label} 
            size="small"
            sx={{ 
              bgcolor: alpha(color, 0.1),
              color: color,
              fontWeight: 'medium',
            }}
          />
        );
      }
    },
  ];

  const handleAddPayment = () => {
    console.log('Add payment');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditPayment = (id: number) => {
    console.log('Edit payment with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeletePayment = (id: number) => {
    console.log('Delete payment with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewPayment = (id: number) => {
    console.log('View payment with ID:', id);
    // In a real application, this would navigate to a payment details page
  };

  return (
    <EntityManagement
      title="Payment Management"
      subtitle="Manage customer payments and transactions"
      columns={columns}
      data={payments}
      onAdd={handleAddPayment}
      onEdit={handleEditPayment}
      onDelete={handleDeletePayment}
      onView={handleViewPayment}
    />
  );
};

export default Payments; 