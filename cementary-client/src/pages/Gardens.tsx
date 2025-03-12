import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, CircularProgress, Box } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import GardenForm from '../components/GardenForm';
import axios from 'axios';

// Backend Garden type
interface Garden {
  garden_id: number;
  garden_name: string;
  cemetery_id: number;
  cemetery: {
    cemetery_id: number;
    cemetery_name: string;
  };
  description: string;
  created_at: string;
  updated_at: string;
  lots: any[];
}

// Form Garden type
interface GardenFormData {
  garden_id?: number;
  garden_name: string;
  cemetery_id: number;
  description: string;
}

// Display type for EntityManagement
interface GardenDisplay extends Garden {
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

const Gardens: React.FC = () => {
  const theme = useTheme();
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<GardenFormData | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const fetchGardens = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get<Garden[]>(`${process.env.REACT_APP_API_URL}/gardens`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Gardens data:', response.data);
      setGardens(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching gardens:', err);
      setError(err.response?.data?.message || 'Failed to load gardens data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardens();
  }, []);

  // Map gardens to include id field for EntityManagement
  const gardensWithId: GardenDisplay[] = gardens.map(garden => ({
    ...garden,
    id: garden.garden_id
  }));

  const columns: Column[] = [
    { id: 'garden_id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'garden_name', label: 'Name', minWidth: 150, sortable: true },
    { 
      id: 'cemetery', 
      label: 'Cemetery', 
      minWidth: 180,
      sortable: true,
      format: (value: any) => value?.cemetery_name || 'N/A'
    },
    { id: 'description', label: 'Description', minWidth: 200, sortable: true },
    { 
      id: 'lots', 
      label: 'Lots', 
      minWidth: 80,
      align: 'right',
      sortable: true,
      format: (lots: any[]) => lots ? lots.length : 0
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: false, // Status is computed, not a direct field
      format: (value: string, row: any) => {
        // Determine status based on lots
        const lots = row.lots || [];
        let status = 'active';
        
        if (lots.length === 0) {
          status = 'empty';
        } else if (lots.some((lot: any) => lot.status === 'maintenance')) {
          status = 'maintenance';
        }
        
        let color;
        let label = status.charAt(0).toUpperCase() + status.slice(1);
        
        switch (status) {
          case 'active':
            color = theme.palette.success.main;
            break;
          case 'maintenance':
            color = theme.palette.warning.main;
            break;
          case 'empty':
            color = theme.palette.info.main;
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

  const handleAddGarden = () => {
    setSelectedGarden(undefined);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditGarden = (id: number) => {
    const garden = gardens.find(g => g.garden_id === id);
    if (garden) {
      // Convert backend Garden to GardenFormData
      const formData: GardenFormData = {
        garden_id: garden.garden_id,
        garden_name: garden.garden_name,
        cemetery_id: garden.cemetery_id,
        description: garden.description || '',
      };
      setSelectedGarden(formData);
      setFormError(null);
      setFormOpen(true);
    }
  };

  const handleDeleteGarden = async (id: number) => {
    try {
      console.log('Delete garden with ID:', id);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      await axios.delete(`${process.env.REACT_APP_API_URL}/gardens/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted garden from the state
      setGardens(gardens.filter(garden => garden.garden_id !== id));
    } catch (err: any) {
      console.error('Error deleting garden:', err);
      setError(err.response?.data?.message || 'Failed to delete garden');
    }
  };

  const handleViewGarden = (id: number) => {
    console.log('View garden with ID:', id);
    // In a real application, this would navigate to a garden details page
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (formData: GardenFormData) => {
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
      
      // Ensure cemetery_id is a number
      const submissionData = {
        ...formData,
        cemetery_id: Number(formData.cemetery_id)
      };
      
      if (selectedGarden?.garden_id) {
        // Update existing garden
        // Remove garden_id from the request body
        const { garden_id, ...updateData } = submissionData;
        
        console.log('Updating garden with ID:', selectedGarden.garden_id);
        console.log('Update data:', updateData);
        
        const response = await axios.patch<Garden>(
          `${process.env.REACT_APP_API_URL}/gardens/${selectedGarden.garden_id}`,
          updateData,
          { headers }
        );
        
        // Update the garden in the state
        setGardens(gardens.map(g => 
          g.garden_id === selectedGarden.garden_id ? response.data : g
        ));
      } else {
        // Create new garden
        console.log('Creating new garden:', submissionData);
        
        const response = await axios.post<Garden>(
          `${process.env.REACT_APP_API_URL}/gardens`,
          submissionData,
          { headers }
        );
        
        // Add the new garden to the state
        setGardens([...gardens, response.data]);
      }
      
      setFormLoading(false);
      setFormOpen(false);
    } catch (err: any) {
      console.error('Error saving garden:', err);
      setFormError(err.response?.data?.message || 'Failed to save garden');
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
        subtitle="Manage cemetery gardens and sections"
        columns={columns}
        data={gardensWithId}
        onAdd={handleAddGarden}
        onEdit={handleEditGarden}
        onDelete={handleDeleteGarden}
        onView={handleViewGarden}
        error={error}
      />
      
      <GardenForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        garden={selectedGarden}
        loading={formLoading}
        error={formError}
      />
    </>
  );
};

export default Gardens; 