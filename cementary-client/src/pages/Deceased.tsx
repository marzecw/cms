import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface DeceasedPerson {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  gender: string;
  spaceId: number | null;
  spaceNumber: string | null;
  lotNumber: string | null;
  gardenName: string | null;
  cemeteryName: string | null;
  intermentDate: string | null;
  intermentStatus: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  memorialDetails: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Deceased: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for deceased persons
  const [deceasedPersons] = useState<DeceasedPerson[]>([
    {
      id: 1,
      firstName: 'James',
      lastName: 'Wilson',
      dateOfBirth: '1945-03-12',
      dateOfDeath: '2023-01-15',
      gender: 'male',
      spaceId: 2,
      spaceNumber: 'A-101-2',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      intermentDate: '2023-01-20',
      intermentStatus: 'interred',
      nextOfKinName: 'Sarah Wilson',
      nextOfKinPhone: '(555) 123-4567',
      memorialDetails: 'Granite headstone with inscription',
    },
    {
      id: 2,
      firstName: 'Elizabeth',
      lastName: 'Taylor',
      dateOfBirth: '1952-07-22',
      dateOfDeath: '2023-02-10',
      gender: 'female',
      spaceId: 4,
      spaceNumber: 'A-101-4',
      lotNumber: 'A-101',
      gardenName: 'Rose Garden',
      cemeteryName: 'Evergreen Memorial',
      intermentDate: '2023-02-15',
      intermentStatus: 'interred',
      nextOfKinName: 'Michael Taylor',
      nextOfKinPhone: '(555) 234-5678',
      memorialDetails: 'Bronze plaque with floral design',
    },
    {
      id: 3,
      firstName: 'Richard',
      lastName: 'Brown',
      dateOfBirth: '1938-11-05',
      dateOfDeath: '2023-03-20',
      gender: 'male',
      spaceId: null,
      spaceNumber: null,
      lotNumber: null,
      gardenName: null,
      cemeteryName: null,
      intermentDate: null,
      intermentStatus: 'pending',
      nextOfKinName: 'Jennifer Brown',
      nextOfKinPhone: '(555) 345-6789',
      memorialDetails: 'Pending selection',
    },
    {
      id: 4,
      firstName: 'Margaret',
      lastName: 'Johnson',
      dateOfBirth: '1942-09-18',
      dateOfDeath: '2023-04-05',
      gender: 'female',
      spaceId: 8,
      spaceNumber: 'C-301-2',
      lotNumber: 'C-301',
      gardenName: 'Maple Garden',
      cemeteryName: 'Memorial Gardens',
      intermentDate: '2023-04-10',
      intermentStatus: 'interred',
      nextOfKinName: 'Robert Johnson',
      nextOfKinPhone: '(555) 456-7890',
      memorialDetails: 'Marble headstone with custom engraving',
    },
    {
      id: 5,
      firstName: 'Thomas',
      lastName: 'Davis',
      dateOfBirth: '1950-05-30',
      dateOfDeath: '2023-05-15',
      gender: 'male',
      spaceId: null,
      spaceNumber: null,
      lotNumber: null,
      gardenName: null,
      cemeteryName: null,
      intermentDate: null,
      intermentStatus: 'cremated',
      nextOfKinName: 'Emily Davis',
      nextOfKinPhone: '(555) 567-8901',
      memorialDetails: 'Urn with custom engraving',
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
    { id: 'dateOfBirth', label: 'Date of Birth', minWidth: 120 },
    { id: 'dateOfDeath', label: 'Date of Death', minWidth: 120 },
    { 
      id: 'age', 
      label: 'Age', 
      minWidth: 80,
      align: 'center',
      format: (value: any, row: any) => {
        if (!row || !row.dateOfBirth || !row.dateOfDeath) return 'N/A';
        const birth = new Date(row.dateOfBirth);
        const death = new Date(row.dateOfDeath);
        const ageInYears = Math.floor((death.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        return ageInYears;
      },
    },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 200,
      format: (value: any, row: any) => {
        if (!row) return 'N/A';
        if (!row.spaceNumber) {
          return 'Not interred';
        }
        return `${row.spaceNumber}, ${row.gardenName}`;
      },
    },
    { id: 'intermentDate', label: 'Interment Date', minWidth: 120 },
    { 
      id: 'intermentStatus', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        if (!value) return 'N/A';
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'interred':
            color = theme.palette.success.main;
            break;
          case 'pending':
            color = theme.palette.warning.main;
            break;
          case 'cremated':
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
    { id: 'nextOfKinName', label: 'Next of Kin', minWidth: 150 },
  ];

  const handleAddDeceased = () => {
    console.log('Add deceased person');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditDeceased = (id: number) => {
    console.log('Edit deceased person with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteDeceased = (id: number) => {
    console.log('Delete deceased person with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewDeceased = (id: number) => {
    console.log('View deceased person with ID:', id);
    // In a real application, this would navigate to a deceased person details page
  };

  return (
    <EntityManagement
      title="Deceased Records"
      subtitle="Manage records of deceased individuals"
      columns={columns}
      data={deceasedPersons}
      onAdd={handleAddDeceased}
      onEdit={handleEditDeceased}
      onDelete={handleDeleteDeceased}
      onView={handleViewDeceased}
    />
  );
};

export default Deceased; 