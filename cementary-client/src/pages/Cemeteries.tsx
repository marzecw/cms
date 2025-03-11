import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Cemetery {
  id: number;
  name: string;
  location: string;
  size: string;
  established: string;
  tenantId: number;
  tenantName: string;
  status: string;
  totalGardens: number;
  totalLots: number;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

const Cemeteries: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for cemeteries
  const [cemeteries] = useState<Cemetery[]>([
    {
      id: 1,
      name: 'Evergreen Memorial',
      location: 'Springfield, IL',
      size: '45 acres',
      established: '1925',
      tenantId: 1,
      tenantName: 'Evergreen Cemetery',
      status: 'active',
      totalGardens: 5,
      totalLots: 120,
    },
    {
      id: 2,
      name: 'Peaceful Rest',
      location: 'Riverdale, NY',
      size: '32 acres',
      established: '1940',
      tenantId: 2,
      tenantName: 'Peaceful Gardens',
      status: 'active',
      totalGardens: 3,
      totalLots: 85,
    },
    {
      id: 3,
      name: 'Memorial Gardens',
      location: 'Portland, OR',
      size: '28 acres',
      established: '1952',
      tenantId: 3,
      tenantName: 'Memorial Park',
      status: 'active',
      totalGardens: 4,
      totalLots: 95,
    },
    {
      id: 4,
      name: 'Sunset Valley',
      location: 'Denver, CO',
      size: '38 acres',
      established: '1963',
      tenantId: 4,
      tenantName: 'Sunset Hills',
      status: 'maintenance',
      totalGardens: 6,
      totalLots: 150,
    },
    {
      id: 5,
      name: 'Lakeside Memorial',
      location: 'Chicago, IL',
      size: '42 acres',
      established: '1935',
      tenantId: 5,
      tenantName: 'Lakeside Cemetery',
      status: 'active',
      totalGardens: 7,
      totalLots: 180,
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 180 },
    { id: 'location', label: 'Location', minWidth: 150 },
    { id: 'size', label: 'Size', minWidth: 100 },
    { id: 'established', label: 'Established', minWidth: 120 },
    { id: 'tenantName', label: 'Tenant', minWidth: 150 },
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
    { 
      id: 'totalGardens', 
      label: 'Gardens', 
      minWidth: 100,
      align: 'right',
    },
    { 
      id: 'totalLots', 
      label: 'Lots', 
      minWidth: 100,
      align: 'right',
    },
  ];

  const handleAddCemetery = () => {
    console.log('Add cemetery');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditCemetery = (id: number) => {
    console.log('Edit cemetery with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteCemetery = (id: number) => {
    console.log('Delete cemetery with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewCemetery = (id: number) => {
    console.log('View cemetery with ID:', id);
    // In a real application, this would navigate to a cemetery details page
  };

  return (
    <EntityManagement
      title=""
      subtitle="Manage cemetery properties and locations"
      columns={columns}
      data={cemeteries}
      onAdd={handleAddCemetery}
      onEdit={handleEditCemetery}
      onDelete={handleDeleteCemetery}
      onView={handleViewCemetery}
    />
  );
};

export default Cemeteries; 