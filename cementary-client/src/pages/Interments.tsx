import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface Interment {
  id: number;
  intermentNumber: string;
  deceasedId: number;
  deceasedName: string;
  spaceId: number;
  spaceNumber: string;
  lotNumber: string;
  gardenName: string;
  cemeteryName: string;
  intermentDate: string;
  intermentType: string;
  status: string;
  performedBy: string;
  witnessName: string;
  ceremonyDetails: string;
  notes: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Interments: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for interments
  const [interments] = useState<Interment[]>([
    {
      id: 1,
      intermentNumber: 'INT-2023-001',
      deceasedId: 1,
      deceasedName: 'James Wilson',
      spaceId: 2,
      spaceNumber: 'A-101-2',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      intermentDate: '2023-01-20',
      intermentType: 'burial',
      status: 'completed',
      performedBy: 'Rev. John Smith',
      witnessName: 'Sarah Wilson',
      ceremonyDetails: 'Traditional funeral service',
      notes: 'Family requested privacy',
    },
    {
      id: 2,
      intermentNumber: 'INT-2023-002',
      deceasedId: 2,
      deceasedName: 'Elizabeth Taylor',
      spaceId: 4,
      spaceNumber: 'A-101-4',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      intermentDate: '2023-02-15',
      intermentType: 'burial',
      status: 'completed',
      performedBy: 'Rev. Mary Johnson',
      witnessName: 'Michael Taylor',
      ceremonyDetails: 'Religious ceremony with choir',
      notes: 'Large attendance',
    },
    {
      id: 3,
      intermentNumber: 'INT-2023-003',
      deceasedId: 3,
      deceasedName: 'Richard Brown',
      spaceId: 5,
      spaceNumber: 'B-201-1',
      lotNumber: 'B-201',
      gardenName: 'Willow Garden',
      cemeteryName: 'Evergreen Memorial',
      intermentDate: '2023-03-25',
      intermentType: 'burial',
      status: 'scheduled',
      performedBy: 'Rev. David Williams',
      witnessName: 'Jennifer Brown',
      ceremonyDetails: 'Military honors ceremony',
      notes: 'Veteran of armed forces',
    },
    {
      id: 4,
      intermentNumber: 'INT-2023-004',
      deceasedId: 4,
      deceasedName: 'Margaret Johnson',
      spaceId: 8,
      spaceNumber: 'C-301-2',
      lotNumber: 'C-301',
      gardenName: 'Maple Garden',
      cemeteryName: 'Memorial Gardens',
      intermentDate: '2023-04-10',
      intermentType: 'burial',
      status: 'completed',
      performedBy: 'Rev. Sarah Davis',
      witnessName: 'Robert Johnson',
      ceremonyDetails: 'Simple family ceremony',
      notes: 'Family requested no flowers',
    },
    {
      id: 5,
      intermentNumber: 'INT-2023-005',
      deceasedId: 5,
      deceasedName: 'Thomas Davis',
      spaceId: 10,
      spaceNumber: 'D-401-2',
      lotNumber: 'D-401',
      gardenName: 'Oak Garden',
      cemeteryName: 'Peaceful Rest',
      intermentDate: '2023-05-20',
      intermentType: 'cremation',
      status: 'scheduled',
      performedBy: 'Rev. James Wilson',
      witnessName: 'Emily Davis',
      ceremonyDetails: 'Memorial service with reception',
      notes: 'Ashes to be placed in memorial urn',
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'intermentNumber', label: 'Interment #', minWidth: 150 },
    { id: 'deceasedName', label: 'Deceased', minWidth: 180 },
    { id: 'intermentDate', label: 'Date', minWidth: 120 },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 200,
      format: (value: any, row: any) => `${row.spaceNumber}, ${row.gardenName}`,
    },
    { 
      id: 'intermentType', 
      label: 'Type', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'burial':
            color = theme.palette.primary.main;
            break;
          case 'cremation':
            color = theme.palette.secondary.main;
            break;
          case 'entombment':
            color = theme.palette.info.main;
            break;
          default:
            color = theme.palette.warning.main;
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
          case 'completed':
            color = theme.palette.success.main;
            break;
          case 'scheduled':
            color = theme.palette.warning.main;
            break;
          case 'cancelled':
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
    { id: 'performedBy', label: 'Performed By', minWidth: 150 },
    { id: 'witnessName', label: 'Witness', minWidth: 150 },
  ];

  const handleAddInterment = () => {
    console.log('Add interment');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditInterment = (id: number) => {
    console.log('Edit interment with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteInterment = (id: number) => {
    console.log('Delete interment with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewInterment = (id: number) => {
    console.log('View interment with ID:', id);
    // In a real application, this would navigate to an interment details page
  };

  return (
    <EntityManagement
      title="Interment Management"
      subtitle="Manage cemetery interment records"
      columns={columns}
      data={interments}
      onAdd={handleAddInterment}
      onEdit={handleEditInterment}
      onDelete={handleDeleteInterment}
      onView={handleViewInterment}
    />
  );
};

export default Interments; 