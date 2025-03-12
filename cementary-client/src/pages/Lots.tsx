import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, Button, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EntityManagement from '../components/EntityManagement';
import { Visibility as ViewIcon } from '@mui/icons-material';
import LotService, { LotResponse } from '../services/lot.service';
import LotForm from '../components/LotForm';
import ConfirmationDialog from '../components/ConfirmationDialog';

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

interface LotFormData {
  lot_id?: number;
  lot_number: string;
  garden_id: number;
  status?: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
}

const Lots: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotFormData | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    lotId: number | null;
    lotNumber: string;
  }>({
    open: false,
    lotId: null,
    lotNumber: '',
  });

  const fetchLots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const lotsData = await LotService.getLots();
      console.log('Lots data from API:', lotsData);
      
      // Transform the API response to match our component's data structure
      const formattedLots = lotsData.map((lot: LotResponse) => ({
        id: lot.lot_id,
        lotNumber: lot.lot_number,
        gardenId: lot.garden_id,
        gardenName: lot.garden?.garden_name || 'N/A',
        cemeteryName: lot.garden?.cemetery?.cemetery_name || 'N/A',
        size: 'Standard', // This might need to be added to the backend model
        totalSpaces: lot.spaces?.length || 0,
        availableSpaces: lot.spaces?.filter(space => space.status === 'available')?.length || 0,
        price: 0, // This might need to be added to the backend model
        status: lot.status || 'available',
      }));
      
      setLots(formattedLots);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching lots:', err);
      setError(err.response?.data?.message || 'Failed to load lots data');
      setLoading(false);
      
      // Use mock data for testing when API fails
      setLots([
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
      ]);
      
      setSnackbar({
        open: true,
        message: 'Failed to fetch lots from API, using mock data',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'lotNumber', label: 'Lot Number', minWidth: 120, sortable: true },
    { id: 'gardenName', label: 'Garden', minWidth: 150, sortable: true },
    { id: 'cemeteryName', label: 'Cemetery', minWidth: 180, sortable: true },
    { id: 'size', label: 'Size', minWidth: 100, sortable: true },
    { 
      id: 'totalSpaces', 
      label: 'Total Spaces', 
      minWidth: 120,
      align: 'right',
      sortable: true,
    },
    { 
      id: 'availableSpaces', 
      label: 'Available', 
      minWidth: 100,
      align: 'right',
      sortable: true,
    },
    { 
      id: 'price', 
      label: 'Price ($)', 
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value: number) => value.toLocaleString('en-US'),
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
      sortable: false,
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
    setSelectedLot(undefined);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditLot = (id: number) => {
    const lot = lots.find(l => l.id === id);
    if (lot) {
      // Convert display Lot to LotFormData
      const formData: LotFormData = {
        lot_id: lot.id,
        lot_number: lot.lotNumber,
        garden_id: lot.gardenId,
        status: lot.status,
      };
      setSelectedLot(formData);
      setFormError(null);
      setFormOpen(true);
    }
  };

  const handleDeleteLot = (id: number) => {
    const lot = lots.find(l => l.id === id);
    if (lot) {
      setConfirmDialog({
        open: true,
        lotId: id,
        lotNumber: lot.lotNumber,
      });
    }
  };

  const confirmDeleteLot = async () => {
    if (confirmDialog.lotId) {
      try {
        setLoading(true);
        await LotService.deleteLot(confirmDialog.lotId);
        
        // Remove the deleted lot from the state
        setLots(lots.filter(lot => lot.id !== confirmDialog.lotId));
        
        setSnackbar({
          open: true,
          message: 'Lot deleted successfully',
          severity: 'success',
        });
      } catch (err: any) {
        console.error('Error deleting lot:', err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to delete lot',
          severity: 'error',
        });
      } finally {
        setLoading(false);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    }
  };

  const handleViewLot = (id: number) => {
    navigate(`/lots/${id}`);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (formData: LotFormData) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      if (selectedLot?.lot_id) {
        // Update existing lot
        console.log('Updating lot with ID:', selectedLot.lot_id);
        
        // Remove lot_id from the request body
        const { lot_id, ...updateData } = formData;
        console.log('Update data:', updateData);
        
        await LotService.updateLot(selectedLot.lot_id, updateData);
        
        // Refresh the lots data to get updated garden information
        await fetchLots();
        
        setSnackbar({
          open: true,
          message: 'Lot updated successfully',
          severity: 'success',
        });
      } else {
        // Create new lot
        console.log('Creating new lot:', formData);
        
        await LotService.createLot(formData);
        
        // Refresh the lots data to get complete garden information
        await fetchLots();
        
        setSnackbar({
          open: true,
          message: 'Lot created successfully',
          severity: 'success',
        });
      }
      
      setFormLoading(false);
      setFormOpen(false);
    } catch (err: any) {
      console.error('Error saving lot:', err);
      setFormError(err.response?.data?.message || 'Failed to save lot');
      setFormLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        subtitle="Manage cemetery lots and their spaces"
        columns={columns}
        data={lots}
        onAdd={handleAddLot}
        onEdit={handleEditLot}
        onDelete={handleDeleteLot}
        onView={handleViewLot}
        error={error}
      />
      
      <LotForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        lot={selectedLot}
        loading={formLoading}
        error={formError}
      />
      
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Delete Lot"
        message={`Are you sure you want to delete the lot "${confirmDialog.lotNumber}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteLot}
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

export default Lots; 