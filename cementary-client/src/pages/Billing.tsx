import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  billingDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  description: string;
  itemCount: number;
  paymentCount: number;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Billing: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for invoices
  const [invoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: 'INV-2023-001',
      customerId: 1,
      customerName: 'John Smith',
      billingDate: '2023-01-15',
      dueDate: '2023-02-15',
      totalAmount: 3500,
      paidAmount: 3500,
      balanceAmount: 0,
      status: 'paid',
      description: 'Space purchase - A-101-1',
      itemCount: 3,
      paymentCount: 1,
    },
    {
      id: 2,
      invoiceNumber: 'INV-2023-002',
      customerId: 2,
      customerName: 'Mary Johnson',
      billingDate: '2023-02-10',
      dueDate: '2023-03-10',
      totalAmount: 4200,
      paidAmount: 2100,
      balanceAmount: 2100,
      status: 'partial',
      description: 'Space purchase - A-101-3',
      itemCount: 4,
      paymentCount: 1,
    },
    {
      id: 3,
      invoiceNumber: 'INV-2023-003',
      customerId: 3,
      customerName: 'Robert Williams',
      billingDate: '2023-03-05',
      dueDate: '2023-04-05',
      totalAmount: 2800,
      paidAmount: 0,
      balanceAmount: 2800,
      status: 'unpaid',
      description: 'Space reservation - B-201-1',
      itemCount: 2,
      paymentCount: 0,
    },
    {
      id: 4,
      invoiceNumber: 'INV-2023-004',
      customerId: 4,
      customerName: 'Jennifer Brown',
      billingDate: '2023-04-20',
      dueDate: '2023-05-20',
      totalAmount: 5500,
      paidAmount: 5500,
      balanceAmount: 0,
      status: 'paid',
      description: 'Space purchase and interment - C-301-2',
      itemCount: 5,
      paymentCount: 2,
    },
    {
      id: 5,
      invoiceNumber: 'INV-2023-005',
      customerId: 5,
      customerName: 'Michael Davis',
      billingDate: '2023-05-12',
      dueDate: '2023-06-12',
      totalAmount: 3200,
      paidAmount: 1000,
      balanceAmount: 2200,
      status: 'partial',
      description: 'Space reservation - D-401-1',
      itemCount: 3,
      paymentCount: 1,
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'invoiceNumber', label: 'Invoice #', minWidth: 150 },
    { id: 'customerName', label: 'Customer', minWidth: 180 },
    { id: 'billingDate', label: 'Billing Date', minWidth: 120 },
    { id: 'dueDate', label: 'Due Date', minWidth: 120 },
    { 
      id: 'totalAmount', 
      label: 'Total ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { 
      id: 'paidAmount', 
      label: 'Paid ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { 
      id: 'balanceAmount', 
      label: 'Balance ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'paid':
            color = theme.palette.success.main;
            break;
          case 'unpaid':
            color = theme.palette.error.main;
            break;
          case 'partial':
            color = theme.palette.warning.main;
            break;
          case 'cancelled':
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
    { 
      id: 'itemCount', 
      label: 'Items', 
      minWidth: 80,
      align: 'center',
    },
    { 
      id: 'paymentCount', 
      label: 'Payments', 
      minWidth: 100,
      align: 'center',
    },
  ];

  const handleAddInvoice = () => {
    console.log('Add invoice');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditInvoice = (id: number) => {
    console.log('Edit invoice with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteInvoice = (id: number) => {
    console.log('Delete invoice with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewInvoice = (id: number) => {
    console.log('View invoice with ID:', id);
    // In a real application, this would navigate to an invoice details page
  };

  return (
    <EntityManagement
      title="Billing Management"
      subtitle="Manage customer invoices and billing"
      columns={columns}
      data={invoices}
      onAdd={handleAddInvoice}
      onEdit={handleEditInvoice}
      onDelete={handleDeleteInvoice}
      onView={handleViewInvoice}
    />
  );
};

export default Billing; 