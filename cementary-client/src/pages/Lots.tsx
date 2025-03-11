import React, { useState } from 'react';
import { Chip, useTheme, alpha, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EntityManagement from '../components/EntityManagement';
import { Visibility as ViewIcon } from '@mui/icons-material';

interface Lot {
  id: number;
  lotNumber: string;
  gardenId: number;
  gardenName: string;
  cemeteryName: string;
  size: string;
  totalSpaces: number;
  availableSpaces: number;
  price: number;
  status: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Lots: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Mock data for lots
  const [lots] = useState<Lot[]>([
    {
      id: 1,
      lotNumber: 'A-101',
      gardenId: 1,
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      size: '100 sq ft',
      totalSpaces: 4,
      availableSpaces: 2,
      price: 3500,
      status: 'available',
    },
    {
      id: 2,
      lotNumber: 'A-102',
      gardenId: 1,
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      size: '100 sq ft',
      totalSpaces: 4,
      availableSpaces: 0,
      price: 3500,
      status: 'sold',
    },
    {
      id: 3,
      lotNumber: 'B-201',
      gardenId: 2,
      gardenName: 'Willow Garden',
      cemeteryName: 'Evergreen Memorial',
      size: '120 sq ft',
      totalSpaces: 6,
      availableSpaces: 4,
      price: 4200,
      status: 'available',
    },
    {
      id: 4,
      lotNumber: 'A-105',
      gardenId: 3,
      gardenName: 'Oak Garden',
      cemeteryName: 'Peaceful Rest',
      size: '80 sq ft',
      totalSpaces: 3,
      availableSpaces: 1,
      price: 2800,
      status: 'available',
    },
    {
      id: 5,
      lotNumber: 'C-301',
      gardenId: 4,
      gardenName: 'Maple Garden',
      cemeteryName: 'Memorial Gardens',
      size: '150 sq ft',
      totalSpaces: 8,
      availableSpaces: 8,
      price: 5500,
      status: 'maintenance',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'lotNumber', label: 'Lot Number', minWidth: 120 },
    { id: 'gardenName', label: 'Garden', minWidth: 150 },
    { id: 'cemeteryName', label: 'Cemetery', minWidth: 180 },
    { id: 'size', label: 'Size', minWidth: 100 },
    { 
      id: 'totalSpaces', 
      label: 'Total Spaces', 
      minWidth: 120,
      align: 'right',
    },
    { 
      id: 'availableSpaces', 
      label: 'Available', 
      minWidth: 100,
      align: 'right',
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
          case 'maintenance':
            color = theme.palette.warning.main;
            break;
          case 'sold':
            color = theme.palette.info.main;
            break;
          case 'reserved':
            color = theme.palette.secondary.main;
            break;
          default:
            color = theme.palette.error.main;
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
      id: 'actions',
      label: 'View Map',
      minWidth: 120,
      align: 'center',
      format: (value: any, row: any) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ViewIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/lots/${row.id}`);
          }}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          View Map
        </Button>
      ),
    },
  ];

  const handleAddLot = () => {
    console.log('Add lot');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditLot = (id: number) => {
    console.log('Edit lot with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteLot = (id: number) => {
    console.log('Delete lot with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewLot = (id: number) => {
    navigate(`/lots/${id}`);
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage cemetery lots and their spaces"
      columns={columns}
      data={lots}
      onAdd={handleAddLot}
      onEdit={handleEditLot}
      onDelete={handleDeleteLot}
      onView={handleViewLot}
    />
  );
};

export default Lots; 