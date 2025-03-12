import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Chip,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SpaceLevel, SpaceLevelService } from '../services/space-level.service';
import SpaceLevelForm from '../components/SpaceLevelForm';
import EntityManagement from '../components/EntityManagement';

const SpaceLevelManagement: React.FC = () => {
  const [spaceLevels, setSpaceLevels] = useState<SpaceLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedSpaceLevel, setSelectedSpaceLevel] = useState<SpaceLevel | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const spaceLevelService = new SpaceLevelService();

  const fetchSpaceLevels = async () => {
    setLoading(true);
    try {
      const data = await spaceLevelService.getSpaceLevels();
      setSpaceLevels(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching space levels:', err);
      setError('Failed to load space levels. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to load space levels',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceLevels();
  }, []);

  const handleOpenForm = (spaceLevel?: SpaceLevel) => {
    setSelectedSpaceLevel(spaceLevel || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedSpaceLevel(null);
  };

  const handleSubmit = async (data: SpaceLevel) => {
    try {
      // Create a clean copy of the data without properties that should not be sent to the API
      const cleanData = {
        name: data.name,
        description: data.description,
        price: data.price,
        status: data.status,
        space_id: data.space_id
      };
      
      if (selectedSpaceLevel) {
        // Update existing space level
        await spaceLevelService.updateSpaceLevel(selectedSpaceLevel.level_id!, cleanData);
        setSnackbar({
          open: true,
          message: 'Space level updated successfully',
          severity: 'success',
        });
      } else {
        // Create new space level
        await spaceLevelService.createSpaceLevel(cleanData);
        setSnackbar({
          open: true,
          message: 'Space level created successfully',
          severity: 'success',
        });
      }
      handleCloseForm();
      fetchSpaceLevels();
    } catch (err) {
      console.error('Error saving space level:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save space level',
        severity: 'error',
      });
    }
  };

  const handleOpenDeleteDialog = (spaceLevel: SpaceLevel) => {
    setSelectedSpaceLevel(spaceLevel);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSpaceLevel(null);
  };

  const handleOpenViewDialog = (spaceLevel: SpaceLevel) => {
    setSelectedSpaceLevel(spaceLevel);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedSpaceLevel(null);
  };

  const handleDelete = async () => {
    if (!selectedSpaceLevel) return;
    
    try {
      await spaceLevelService.deleteSpaceLevel(selectedSpaceLevel.level_id!);
      setSnackbar({
        open: true,
        message: 'Space level deleted successfully',
        severity: 'success',
      });
      handleCloseDeleteDialog();
      fetchSpaceLevels();
    } catch (err) {
      console.error('Error deleting space level:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete space level',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    
    switch (status.toLowerCase()) {
      case 'available':
        color = 'success';
        break;
      case 'reserved':
        color = 'warning';
        break;
      case 'occupied':
        color = 'error';
        break;
      case 'maintenance':
        color = 'info';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status} color={color} size="small" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const columns = [
    { id: 'level_id', label: 'ID', sortable: true },
    { id: 'name', label: 'Name', sortable: true },
    { 
      id: 'space', 
      label: 'Space', 
      sortable: true,
      format: (value: any) => value?.space_number || 'N/A'
    },
    { 
      id: 'price', 
      label: 'Price', 
      sortable: true,
      format: (value: number) => formatPrice(value)
    },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true,
      format: (value: string) => getStatusChip(value)
    },
    { 
      id: 'created_at', 
      label: 'Created', 
      sortable: true,
      format: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const handleEdit = (id: number) => {
    const spaceLevel = spaceLevels.find(level => level.level_id === id);
    if (spaceLevel) {
      handleOpenForm(spaceLevel);
    }
  };

  const handleDeleteAction = (id: number) => {
    const spaceLevel = spaceLevels.find(level => level.level_id === id);
    if (spaceLevel) {
      handleOpenDeleteDialog(spaceLevel);
    }
  };

  const handleViewAction = (id: number) => {
    const spaceLevel = spaceLevels.find(level => level.level_id === id);
    if (spaceLevel) {
      handleOpenViewDialog(spaceLevel);
    }
  };

  if (loading && spaceLevels.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Space Levels</Typography>
      </Box>

      <EntityManagement
        title="Space Levels"
        subtitle="Manage all space levels in the system"
        data={spaceLevels.map(level => ({
          ...level,
          id: level.level_id // Add id property for EntityManagement component
        }))}
        columns={columns}
        error={error}
        onAdd={() => handleOpenForm()}
        onEdit={handleEdit}
        onDelete={handleDeleteAction}
        onView={handleViewAction}
      />

      {/* Form Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SpaceLevelForm
            initialData={selectedSpaceLevel || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isEdit={!!selectedSpaceLevel}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Space Level Details</DialogTitle>
        <DialogContent>
          {selectedSpaceLevel && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1"><strong>ID:</strong> {selectedSpaceLevel.level_id}</Typography>
              <Typography variant="body1"><strong>Name:</strong> {selectedSpaceLevel.name}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {selectedSpaceLevel.description || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Price:</strong> {formatPrice(selectedSpaceLevel.price)}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {selectedSpaceLevel.status}</Typography>
              <Typography variant="body1"><strong>Space ID:</strong> {selectedSpaceLevel.space_id}</Typography>
              <Typography variant="body1"><strong>Created:</strong> {new Date(selectedSpaceLevel.created_at!).toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Updated:</strong> {new Date(selectedSpaceLevel.updated_at!).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button 
            color="primary" 
            onClick={() => {
              handleCloseViewDialog();
              if (selectedSpaceLevel) {
                handleOpenForm(selectedSpaceLevel);
              }
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the space level "{selectedSpaceLevel?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpaceLevelManagement; 