import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Space {
  id: number;
  spaceNumber: string;
  lotId: number;
  lotNumber: string;
  gardenName: string;
  cemeteryName: string;
  type: string;
  price: number;
  status: string;
  occupantName?: string;
  intermentDate?: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

const Spaces: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for spaces
  const [spaces] = useState<Space[]>([
    {
      id: 1,
      spaceNumber: 'A-101-1',
      lotId: 1,
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      type: 'standard',
      price: 1200,
      status: 'available',
    },
    {
      id: 2,
      spaceNumber: 'A-101-2',
      lotId: 1,
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      type: 'standard',
      price: 1200,
      status: 'occupied',
      occupantName: 'John Smith',
      intermentDate: '2023-05-15',
    },
    {
      id: 3,
      spaceNumber: 'A-101-3',
      lotId: 1,
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      type: 'standard',
      price: 1200,
      status: 'reserved',
    },
    {
      id: 4,
      spaceNumber: 'A-101-4',
      lotId: 1,
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      type: 'premium',
      price: 1800,
      status: 'occupied',
      occupantName: 'Mary Johnson',
      intermentDate: '2023-06-22',
    },
    {
      id: 5,
      spaceNumber: 'B-201-1',
      lotId: 3,
      lotNumber: 'B-201',
      gardenName: 'Willow Garden',
      cemeteryName: 'Evergreen Memorial',
      type: 'premium',
      price: 2000,
      status: 'available',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'spaceNumber', label: 'Space Number', minWidth: 120 },
    { id: 'lotNumber', label: 'Lot Number', minWidth: 120 },
    { id: 'gardenName', label: 'Garden', minWidth: 150 },
    { id: 'cemeteryName', label: 'Cemetery', minWidth: 180 },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'standard':
            color = theme.palette.info.main;
            break;
          case 'premium':
            color = theme.palette.secondary.main;
            break;
          case 'mausoleum':
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
      id: 'price', 
      label: 'Price ($)', 
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
          case 'available':
            color = theme.palette.success.main;
            break;
          case 'reserved':
            color = theme.palette.warning.main;
            break;
          case 'occupied':
            color = theme.palette.error.main;
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
    { 
      id: 'occupantName', 
      label: 'Occupant', 
      minWidth: 150,
      format: (value: string) => value || '-',
    },
  ];

  const handleAddSpace = () => {
    console.log('Add space');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditSpace = (id: number) => {
    console.log('Edit space with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteSpace = (id: number) => {
    console.log('Delete space with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewSpace = (id: number) => {
    console.log('View space with ID:', id);
    // In a real application, this would navigate to a space details page
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage cemetery spaces and burial plots"
      columns={columns}
      data={spaces}
      onAdd={handleAddSpace}
      onEdit={handleEditSpace}
      onDelete={handleDeleteSpace}
      onView={handleViewSpace}
    />
  );
};

export default Spaces; 