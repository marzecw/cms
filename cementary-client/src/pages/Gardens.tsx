import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Garden {
  id: number;
  name: string;
  cemeteryId: number;
  cemeteryName: string;
  section: string;
  size: string;
  totalLots: number;
  totalSpaces: number;
  status: string;
  createdAt: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

const Gardens: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for gardens
  const [gardens] = useState<Garden[]>([
    {
      id: 1,
      name: 'Rose Garden',
      cemeteryId: 1,
      cemeteryName: 'Evergreen Memorial',
      section: 'A',
      size: '5 acres',
      totalLots: 25,
      totalSpaces: 75,
      status: 'active',
      createdAt: '2022-02-15',
    },
    {
      id: 2,
      name: 'Willow Garden',
      cemeteryId: 1,
      cemeteryName: 'Evergreen Memorial',
      section: 'B',
      size: '4 acres',
      totalLots: 20,
      totalSpaces: 60,
      status: 'active',
      createdAt: '2022-03-10',
    },
    {
      id: 3,
      name: 'Oak Garden',
      cemeteryId: 2,
      cemeteryName: 'Peaceful Rest',
      section: 'A',
      size: '3.5 acres',
      totalLots: 18,
      totalSpaces: 54,
      status: 'active',
      createdAt: '2022-04-05',
    },
    {
      id: 4,
      name: 'Maple Garden',
      cemeteryId: 3,
      cemeteryName: 'Memorial Gardens',
      section: 'C',
      size: '4.2 acres',
      totalLots: 22,
      totalSpaces: 66,
      status: 'maintenance',
      createdAt: '2022-05-20',
    },
    {
      id: 5,
      name: 'Pine Garden',
      cemeteryId: 4,
      cemeteryName: 'Sunset Valley',
      section: 'B',
      size: '3.8 acres',
      totalLots: 19,
      totalSpaces: 57,
      status: 'active',
      createdAt: '2022-06-15',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 150 },
    { id: 'cemeteryName', label: 'Cemetery', minWidth: 180 },
    { id: 'section', label: 'Section', minWidth: 100 },
    { id: 'size', label: 'Size', minWidth: 100 },
    { 
      id: 'totalLots', 
      label: 'Lots', 
      minWidth: 80,
      align: 'right',
    },
    { 
      id: 'totalSpaces', 
      label: 'Spaces', 
      minWidth: 80,
      align: 'right',
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'active':
            color = theme.palette.success.main;
            break;
          case 'maintenance':
            color = theme.palette.warning.main;
            break;
          case 'closed':
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
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
  ];

  const handleAddGarden = () => {
    console.log('Add garden');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditGarden = (id: number) => {
    console.log('Edit garden with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteGarden = (id: number) => {
    console.log('Delete garden with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewGarden = (id: number) => {
    console.log('View garden with ID:', id);
    // In a real application, this would navigate to a garden details page
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage cemetery gardens and sections"
      columns={columns}
      data={gardens}
      onAdd={handleAddGarden}
      onEdit={handleEditGarden}
      onDelete={handleDeleteGarden}
      onView={handleViewGarden}
    />
  );
};

export default Gardens; 