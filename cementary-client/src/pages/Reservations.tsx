import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Reservation {
  id: number;
  reservationNumber: string;
  customerId: number;
  customerName: string;
  spaceId: number;
  spaceNumber: string;
  lotNumber: string;
  gardenName: string;
  cemeteryName: string;
  reservationDate: string;
  expiryDate: string;
  status: string;
  amount: number;
  paymentStatus: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
}

const Reservations: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for reservations
  const [reservations] = useState<Reservation[]>([
    {
      id: 1,
      reservationNumber: 'RES-2023-001',
      customerId: 1,
      customerName: 'John Smith',
      spaceId: 1,
      spaceNumber: 'A-101-1',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      reservationDate: '2023-01-15',
      expiryDate: '2023-07-15',
      status: 'active',
      amount: 1200,
      paymentStatus: 'paid',
    },
    {
      id: 2,
      reservationNumber: 'RES-2023-002',
      customerId: 2,
      customerName: 'Mary Johnson',
      spaceId: 3,
      spaceNumber: 'A-101-3',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      reservationDate: '2023-02-10',
      expiryDate: '2023-08-10',
      status: 'active',
      amount: 1200,
      paymentStatus: 'partial',
    },
    {
      id: 3,
      reservationNumber: 'RES-2023-003',
      customerId: 3,
      customerName: 'Robert Williams',
      spaceId: 5,
      spaceNumber: 'B-201-1',
      lotNumber: 'B-201',
      gardenName: 'Willow Garden',
      cemeteryName: 'Evergreen Memorial',
      reservationDate: '2023-03-05',
      expiryDate: '2023-09-05',
      status: 'expired',
      amount: 900,
      paymentStatus: 'unpaid',
    },
    {
      id: 4,
      reservationNumber: 'RES-2023-004',
      customerId: 4,
      customerName: 'Jennifer Brown',
      spaceId: 7,
      spaceNumber: 'C-301-1',
      lotNumber: 'C-301',
      gardenName: 'Maple Garden',
      cemeteryName: 'Memorial Gardens',
      reservationDate: '2023-04-20',
      expiryDate: '2023-10-20',
      status: 'converted',
      amount: 1500,
      paymentStatus: 'paid',
    },
    {
      id: 5,
      reservationNumber: 'RES-2023-005',
      customerId: 5,
      customerName: 'Michael Davis',
      spaceId: 9,
      spaceNumber: 'D-401-1',
      lotNumber: 'D-401',
      gardenName: 'Oak Garden',
      cemeteryName: 'Peaceful Rest',
      reservationDate: '2023-05-12',
      expiryDate: '2023-11-12',
      status: 'active',
      amount: 1100,
      paymentStatus: 'partial',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'reservationNumber', label: 'Reservation #', minWidth: 150, sortable: true },
    { id: 'customerName', label: 'Customer', minWidth: 180, sortable: true },
    { id: 'spaceNumber', label: 'Space', minWidth: 120, sortable: true },
    { id: 'gardenName', label: 'Garden', minWidth: 150, sortable: true },
    { id: 'reservationDate', label: 'Reserved On', minWidth: 120, sortable: true },
    { id: 'expiryDate', label: 'Expires On', minWidth: 120, sortable: true },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'active':
            color = theme.palette.success.main;
            break;
          case 'expired':
            color = theme.palette.error.main;
            break;
          case 'converted':
            color = theme.palette.info.main;
            break;
          case 'cancelled':
            color = theme.palette.warning.main;
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
      id: 'amount', 
      label: 'Amount ($)', 
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value: number) => value.toLocaleString('en-US'),
    },
    { 
      id: 'paymentStatus', 
      label: 'Payment', 
      minWidth: 120,
      sortable: true,
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
          default:
            color = theme.palette.info.main;
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

  const handleAddReservation = () => {
    console.log('Add reservation');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditReservation = (id: number) => {
    console.log('Edit reservation with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteReservation = (id: number) => {
    console.log('Delete reservation with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewReservation = (id: number) => {
    console.log('View reservation with ID:', id);
    // In a real application, this would navigate to a reservation details page
  };

  return (
    <EntityManagement
      title="Reservation Management"
      subtitle="Manage cemetery space reservations"
      columns={columns}
      data={reservations}
      onAdd={handleAddReservation}
      onEdit={handleEditReservation}
      onDelete={handleDeleteReservation}
      onView={handleViewReservation}
    />
  );
};

export default Reservations; 