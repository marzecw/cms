import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, CircularProgress, Box } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import CemeteryForm from '../components/CemeteryForm';
import axios from 'axios';

// Backend Cemetery type
interface Cemetery {
  cemetery_id: number;
  cemetery_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  established_date: string;
  created_at: string;
  updated_at: string;
  gardens: any[];
}

// Form Cemetery type
interface CemeteryFormData {
  cemetery_id?: number;
  cemetery_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  established_date: Date | null;
}

// Display type for EntityManagement
interface CemeteryDisplay extends Cemetery {
  id: number; // Add id field for EntityManagement
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
}

const Cemeteries: React.FC = () => {
  const theme = useTheme();
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCemetery, setSelectedCemetery] = useState<CemeteryFormData | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const fetchCemeteries = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get<Cemetery[]>(`${process.env.REACT_APP_API_URL}/cemeteries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Cemeteries data:', response.data);
      setCemeteries(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching cemeteries:', err);
      setError(err.response?.data?.message || 'Failed to load cemeteries data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCemeteries();
  }, []);

  // Map cemeteries to include id field for EntityManagement
  const cemeteriesWithId: CemeteryDisplay[] = cemeteries.map(cemetery => ({
    ...cemetery,
    id: cemetery.cemetery_id
  }));

  const columns: Column[] = [
    { id: 'cemetery_id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'cemetery_name', label: 'Name', minWidth: 150, sortable: true },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 180,
      sortable: true,
      format: (value: any, row: Cemetery) => {
        return `${row.city}, ${row.state}, ${row.country}`;
      }
    },
    { id: 'address', label: 'Address', minWidth: 200, sortable: true },
    { 
      id: 'established_date', 
      label: 'Established', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => {
        if (!value) return 'N/A';
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return 'N/A';
        }
      }
    },
    { 
      id: 'gardens', 
      label: 'Gardens', 
      minWidth: 80,
      align: 'right',
      sortable: true,
      format: (gardens: any[]) => gardens ? gardens.length : 0
    },
    { 
      id: 'created_at', 
      label: 'Created At', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => {
        if (!value) return 'N/A';
        try {
          return new Date(value).toLocaleDateString();
        } catch (e) {
          return 'N/A';
        }
      }
    },
  ];

  const handleAddCemetery = () => {
    setSelectedCemetery(undefined);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditCemetery = (id: number) => {
    const cemetery = cemeteries.find(c => c.cemetery_id === id);
    if (cemetery) {
      // Convert backend Cemetery to CemeteryFormData
      const formData: CemeteryFormData = {
        cemetery_id: cemetery.cemetery_id,
        cemetery_name: cemetery.cemetery_name,
        address: cemetery.address || '',
        city: cemetery.city || '',
        state: cemetery.state || '',
        country: cemetery.country || '',
        established_date: cemetery.established_date ? new Date(cemetery.established_date) : null,
      };
      setSelectedCemetery(formData);
      setFormError(null);
      setFormOpen(true);
    }
  };

  const handleDeleteCemetery = async (id: number) => {
    try {
      console.log('Delete cemetery with ID:', id);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      await axios.delete(`${process.env.REACT_APP_API_URL}/cemeteries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted cemetery from the state
      setCemeteries(cemeteries.filter(cemetery => cemetery.cemetery_id !== id));
    } catch (err: any) {
      console.error('Error deleting cemetery:', err);
      setError(err.response?.data?.message || 'Failed to delete cemetery');
    }
  };

  const handleViewCemetery = (id: number) => {
    console.log('View cemetery with ID:', id);
    // In a real application, this would navigate to a cemetery details page
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (formData: CemeteryFormData) => {
    try {
      setFormLoading(true);
      setFormError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setFormError('Authentication token not found. Please log in again.');
        setFormLoading(false);
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      if (selectedCemetery?.cemetery_id) {
        // Update existing cemetery
        // Remove cemetery_id from the request body
        const { cemetery_id, ...updateData } = formData;
        
        console.log('Updating cemetery with ID:', selectedCemetery.cemetery_id);
        console.log('Update data:', updateData);
        
        const response = await axios.patch<Cemetery>(
          `${process.env.REACT_APP_API_URL}/cemeteries/${selectedCemetery.cemetery_id}`,
          updateData,
          { headers }
        );
        
        // Update the cemetery in the state
        setCemeteries(cemeteries.map(c => 
          c.cemetery_id === selectedCemetery.cemetery_id ? response.data : c
        ));
      } else {
        // Create new cemetery
        console.log('Creating new cemetery:', formData);
        
        const response = await axios.post<Cemetery>(
          `${process.env.REACT_APP_API_URL}/cemeteries`,
          formData,
          { headers }
        );
        
        // Add the new cemetery to the state
        setCemeteries([...cemeteries, response.data]);
      }
      
      setFormLoading(false);
      setFormOpen(false);
    } catch (err: any) {
      console.error('Error saving cemetery:', err);
      setFormError(err.response?.data?.message || 'Failed to save cemetery');
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <EntityManagement
        title=""
        subtitle="Manage cemetery properties and locations"
        columns={columns}
        data={cemeteriesWithId}
        onAdd={handleAddCemetery}
        onEdit={handleEditCemetery}
        onDelete={handleDeleteCemetery}
        onView={handleViewCemetery}
        error={error}
      />
      
      <CemeteryForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        cemetery={selectedCemetery}
        loading={formLoading}
        error={formError}
      />
    </>
  );
};

export default Cemeteries; 