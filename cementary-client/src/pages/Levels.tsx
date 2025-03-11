import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Level {
  id: number;
  name: string;
  spaceId: number;
  spaceNumber: string;
  lotNumber: string;
  gardenName: string;
  cemeteryName: string;
  depth: string;
  type: string;
  status: string;
  price: number;
  createdAt: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Levels: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for levels
  const [levels] = useState<Level[]>([
    {
      id: 1,
      name: 'Level 1',
      spaceId: 1,
      spaceNumber: 'A-101-1',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      depth: '0-3 ft',
      type: 'standard',
      status: 'available',
      price: 800,
      createdAt: '2023-01-15',
    },
    {
      id: 2,
      name: 'Level 2',
      spaceId: 1,
      spaceNumber: 'A-101-1',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      depth: '3-6 ft',
      type: 'standard',
      status: 'occupied',
      price: 800,
      createdAt: '2023-01-15',
    },
    {
      id: 3,
      name: 'Level 1',
      spaceId: 2,
      spaceNumber: 'A-101-2',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      depth: '0-3 ft',
      type: 'premium',
      status: 'available',
      price: 1200,
      createdAt: '2023-02-10',
    },
    {
      id: 4,
      name: 'Level 2',
      spaceId: 2,
      spaceNumber: 'A-101-2',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      depth: '3-6 ft',
      type: 'premium',
      status: 'reserved',
      price: 1200,
      createdAt: '2023-02-10',
    },
    {
      id: 5,
      name: 'Level 1',
      spaceId: 3,
      spaceNumber: 'B-201-1',
      lotNumber: 'B-201',
      gardenName: 'Willow Garden',
      cemeteryName: 'Evergreen Memorial',
      depth: '0-3 ft',
      type: 'standard',
      status: 'available',
      price: 900,
      createdAt: '2023-03-05',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Level Name', minWidth: 120 },
    { id: 'spaceNumber', label: 'Space', minWidth: 120 },
    { id: 'lotNumber', label: 'Lot', minWidth: 120 },
    { id: 'gardenName', label: 'Garden', minWidth: 150 },
    { id: 'depth', label: 'Depth', minWidth: 100 },
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
      id: 'price', 
      label: 'Price ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  const handleAddLevel = () => {
    console.log('Add level');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditLevel = (id: number) => {
    console.log('Edit level with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteLevel = (id: number) => {
    console.log('Delete level with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewLevel = (id: number) => {
    console.log('View level with ID:', id);
    // In a real application, this would navigate to a level details page
  };

  return (
    <EntityManagement
      title="Level Management"
      subtitle="Manage cemetery space levels and depths"
      columns={columns}
      data={levels}
      onAdd={handleAddLevel}
      onEdit={handleEditLevel}
      onDelete={handleDeleteLevel}
      onView={handleViewLevel}
    />
  );
};

export default Levels; 