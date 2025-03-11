import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  createdAt: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Customers: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for customers
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      status: 'active',
      createdAt: '2023-01-15',
    },
    {
      id: 2,
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.johnson@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave',
      city: 'Riverdale',
      state: 'NY',
      zipCode: '10471',
      status: 'active',
      createdAt: '2023-02-20',
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.williams@example.com',
      phone: '(555) 345-6789',
      address: '789 Pine Rd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97205',
      status: 'inactive',
      createdAt: '2023-03-10',
    },
    {
      id: 4,
      firstName: 'Jennifer',
      lastName: 'Brown',
      email: 'jennifer.brown@example.com',
      phone: '(555) 456-7890',
      address: '321 Maple Dr',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      status: 'active',
      createdAt: '2023-04-05',
    },
    {
      id: 5,
      firstName: 'Michael',
      lastName: 'Davis',
      email: 'michael.davis@example.com',
      phone: '(555) 567-8901',
      address: '654 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      status: 'active',
      createdAt: '2023-05-12',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { 
      id: 'fullName', 
      label: 'Name', 
      minWidth: 180,
      format: (value: any, row: any) => {
        if (!row || !row.firstName || !row.lastName) return 'N/A';
        return `${row.firstName} ${row.lastName}`;
      },
    },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 180,
      format: (value: any, row: any) => {
        if (!row || !row.city || !row.state) return 'N/A';
        return `${row.city}, ${row.state}`;
      },
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        if (!value) return 'N/A';
        let color = value === 'active' ? theme.palette.success.main : theme.palette.error.main;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
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
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
  ];

  const handleAddCustomer = () => {
    console.log('Add customer');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditCustomer = (id: number) => {
    console.log('Edit customer with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteCustomer = (id: number) => {
    console.log('Delete customer with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewCustomer = (id: number) => {
    console.log('View customer with ID:', id);
    // In a real application, this would navigate to a customer details page
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage customer information and records"
      columns={columns}
      data={customers}
      onAdd={handleAddCustomer}
      onEdit={handleEditCustomer}
      onDelete={handleDeleteCustomer}
      onView={handleViewCustomer}
    />
  );
};

export default Customers; 