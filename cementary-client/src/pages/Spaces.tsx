import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, Box, CircularProgress, Snackbar, Alert, Button } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import SpaceService, { SpaceResponse, CreateSpaceDto, UpdateSpaceDto } from '../services/space.service';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SpaceForm from '../components/SpaceForm';

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
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
}

const Spaces: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{
    space_id?: number;
    space_number: string;
    lot_id: number;
    type?: string;
    price?: number;
    status?: string;
  } | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    spaceId: number | null;
    spaceNumber: string;
  }>({
    open: false,
    spaceId: null,
    spaceNumber: '',
  });

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const spacesData = await SpaceService.getSpaces();
      console.log('Spaces data from API:', spacesData);
      
      // Transform the API response to match our component's data structure
      const formattedSpaces = spacesData.map((space: SpaceResponse) => ({
        id: space.space_id,
        spaceNumber: space.space_number,
        lotId: space.lot_id,
        lotNumber: space.lot?.lot_number || 'N/A',
        gardenName: space.lot?.garden?.garden_name || 'N/A',
        cemeteryName: space.lot?.garden?.cemetery?.cemetery_name || 'N/A',
        type: space.type || 'standard',
        price: space.price || 0,
        status: space.status || 'available',
        // These fields might need to be added to the backend model or fetched from a related entity
        occupantName: space.levels && space.levels.length > 0 ? space.levels[0].occupant_name : undefined,
        intermentDate: space.levels && space.levels.length > 0 ? space.levels[0].interment_date : undefined,
      }));
      
      setSpaces(formattedSpaces);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching spaces:', err);
      setError(err.response?.data?.message || 'Failed to load spaces data');
      setLoading(false);
      
      setSnackbar({
        open: true,
        message: 'Failed to fetch spaces from API',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'spaceNumber', label: 'Space Number', minWidth: 120, sortable: true },
    { id: 'lotNumber', label: 'Lot Number', minWidth: 120, sortable: true },
    { id: 'gardenName', label: 'Garden', minWidth: 150, sortable: true },
    { id: 'cemeteryName', label: 'Cemetery', minWidth: 180, sortable: true },
    { 
      id: 'type', 
      label: 'Type', 
      minWidth: 120,
      sortable: true,
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
          case 'cremation':
            color = theme.palette.error.main;
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
      sortable: true,
      format: (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
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
  ];

  const handleAddSpace = () => {
    setSelectedSpace(undefined);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditSpace = (id: number) => {
    const space = spaces.find(s => s.id === id);
    if (space) {
      // Convert display Space to form data
      const formData = {
        space_id: space.id,
        space_number: space.spaceNumber,
        lot_id: space.lotId,
        type: space.type,
        price: space.price,
        status: space.status,
      };
      setSelectedSpace(formData);
      setFormError(null);
      setFormOpen(true);
    }
  };

  const handleDeleteSpace = (id: number) => {
    const space = spaces.find(s => s.id === id);
    if (space) {
      setConfirmDialog({
        open: true,
        spaceId: id,
        spaceNumber: space.spaceNumber,
      });
    }
  };

  const confirmDeleteSpace = async () => {
    if (confirmDialog.spaceId) {
      try {
        setLoading(true);
        await SpaceService.deleteSpace(confirmDialog.spaceId);
        
        // Remove the deleted space from the state
        setSpaces(spaces.filter(space => space.id !== confirmDialog.spaceId));
        
        setSnackbar({
          open: true,
          message: 'Space deleted successfully',
          severity: 'success',
        });
      } catch (err: any) {
        console.error('Error deleting space:', err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to delete space',
          severity: 'error',
        });
      } finally {
        setLoading(false);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    }
  };

  const handleViewSpace = (id: number) => {
    navigate(`/spaces/${id}`);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (formData: CreateSpaceDto | UpdateSpaceDto) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      // Ensure price is a number if it exists in the formData
      const processedData = {
        ...formData,
        price: formData.price !== undefined ? Number(formData.price) : undefined
      };
      
      if (selectedSpace?.space_id) {
        // Update existing space
        console.log('Updating space with ID:', selectedSpace.space_id);
        console.log('Update data:', processedData);
        
        await SpaceService.updateSpace(selectedSpace.space_id, processedData);
        
        // Refresh the spaces data
        await fetchSpaces();
        
        setSnackbar({
          open: true,
          message: 'Space updated successfully',
          severity: 'success',
        });
      } else {
        // Create new space
        console.log('Creating new space with data:', processedData);
        
        await SpaceService.createSpace(processedData as CreateSpaceDto);
        
        // Refresh the spaces data
        await fetchSpaces();
        
        setSnackbar({
          open: true,
          message: 'Space created successfully',
          severity: 'success',
        });
      }
      
      // Close the form
      setFormOpen(false);
    } catch (err: any) {
      console.error('Error saving space:', err);
      setFormError(err.response?.data?.message || 'Failed to save space');
      
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to save space',
        severity: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && spaces.length === 0) {
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
        subtitle="Manage cemetery spaces and burial plots"
        columns={columns}
        data={spaces}
        onAdd={handleAddSpace}
        onEdit={handleEditSpace}
        onDelete={handleDeleteSpace}
        onView={handleViewSpace}
        error={error}
      />
      
      <SpaceForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        space={selectedSpace}
        loading={formLoading}
        error={formError}
      />
      
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Delete Space"
        message={`Are you sure you want to delete the space "${confirmDialog.spaceNumber}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteSpace}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        isLoading={loading}
        severity="error"
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Spaces; 