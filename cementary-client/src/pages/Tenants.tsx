import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Tenant {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

const Tenants: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for tenants
  const [tenants] = useState<Tenant[]>([
    {
      id: 1,
      name: 'Evergreen Cemetery',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      phone: '(217) 555-1234',
      email: 'info@evergreencemetery.com',
      status: 'active',
      createdAt: '2022-01-10',
    },
    {
      id: 2,
      name: 'Peaceful Gardens',
      address: '456 Oak Ave',
      city: 'Riverdale',
      state: 'NY',
      zipCode: '10471',
      phone: '(718) 555-5678',
      email: 'contact@peacefulgardens.com',
      status: 'active',
      createdAt: '2022-03-15',
    },
    {
      id: 3,
      name: 'Memorial Park',
      address: '789 Pine Rd',
      city: 'Portland',
      state: 'OR',
      zipCode: '97205',
      phone: '(503) 555-9012',
      email: 'info@memorialpark.com',
      status: 'active',
      createdAt: '2022-05-20',
    },
    {
      id: 4,
      name: 'Sunset Hills',
      address: '321 Maple Dr',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      phone: '(303) 555-3456',
      email: 'admin@sunsethills.com',
      status: 'inactive',
      createdAt: '2022-07-25',
    },
    {
      id: 5,
      name: 'Lakeside Cemetery',
      address: '654 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      phone: '(312) 555-7890',
      email: 'info@lakesidecemetery.com',
      status: 'active',
      createdAt: '2022-09-30',
    },
  ]);

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 180 },
    { id: 'city', label: 'City', minWidth: 120 },
    { id: 'state', label: 'State', minWidth: 80 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => (
        <Chip 
          label={value.charAt(0).toUpperCase() + value.slice(1)} 
          size="small"
          sx={{ 
            bgcolor: value === 'active' 
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.error.main, 0.1),
            color: value === 'active' 
              ? theme.palette.success.main
              : theme.palette.error.main,
            fontWeight: 'medium',
          }}
        />
      )
    },
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
  ];

  const handleAddTenant = () => {
    console.log('Add tenant');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditTenant = (id: number) => {
    console.log('Edit tenant with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteTenant = (id: number) => {
    console.log('Delete tenant with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewTenant = (id: number) => {
    console.log('View tenant with ID:', id);
    // In a real application, this would navigate to a tenant details page
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage cemetery organizations and their properties"
      columns={columns}
      data={tenants}
      onAdd={handleAddTenant}
      onEdit={handleEditTenant}
      onDelete={handleDeleteTenant}
      onView={handleViewTenant}
    />
  );
};

export default Tenants; 