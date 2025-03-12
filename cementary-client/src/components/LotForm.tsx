import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';

interface Garden {
  garden_id: number;
  garden_name: string;
}

interface LotFormData {
  lot_id?: number;
  lot_number: string;
  garden_id: number;
  status?: string;
}

interface LotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: LotFormData) => Promise<void>;
  lot?: LotFormData;
  loading?: boolean;
  error?: string | null;
}

const LotForm: React.FC<LotFormProps> = ({
  open,
  onClose,
  onSubmit,
  lot,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<LotFormData>({
    lot_number: '',
    garden_id: 0,
    status: 'available',
  });
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [gardensLoading, setGardensLoading] = useState(false);
  const [gardensError, setGardensError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load gardens when the form opens
  useEffect(() => {
    if (open) {
      fetchGardens();
    }
  }, [open]);

  // Set form data when lot prop changes
  useEffect(() => {
    if (lot) {
      console.log('Setting form data from lot:', lot);
      setFormData({
        lot_id: lot.lot_id,
        lot_number: lot.lot_number,
        garden_id: lot.garden_id,
        status: lot.status || 'available',
      });
    } else {
      // Reset form for new lot
      setFormData({
        lot_number: '',
        garden_id: 0,
        status: 'available',
      });
    }
  }, [lot]);

  const fetchGardens = async () => {
    try {
      setGardensLoading(true);
      setGardensError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setGardensError('Authentication token not found. Please log in again.');
        setGardensLoading(false);
        return;
      }
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/gardens`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Gardens data from API:', response.data);
      setGardens(response.data);
      
      // If there are gardens and no garden is selected, select the first one
      if (response.data.length > 0 && (!formData.garden_id || formData.garden_id === 0)) {
        setFormData(prev => ({
          ...prev,
          garden_id: response.data[0].garden_id
        }));
      }
      
      setGardensLoading(false);
    } catch (err: any) {
      console.error('Error fetching gardens:', err);
      setGardensError(err.response?.data?.message || 'Failed to load gardens');
      setGardensLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleGardenChange = (e: SelectChangeEvent<number>) => {
    const gardenId = Number(e.target.value);
    console.log('Garden selection changed:', e.target.value);
    console.log('Selected garden ID (converted to number):', gardenId);
    console.log('Available gardens:', gardens);
    
    // Find the selected garden to verify it exists
    const selectedGarden = gardens.find(g => g.garden_id === gardenId);
    console.log('Selected garden object:', selectedGarden);
    
    setFormData({
      ...formData,
      garden_id: gardenId,
    });
    
    // Clear error for garden_id
    if (formErrors.garden_id) {
      setFormErrors({
        ...formErrors,
        garden_id: '',
      });
    }
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.lot_number.trim()) {
      errors.lot_number = 'Lot number is required';
    }
    
    if (!formData.garden_id || formData.garden_id === 0) {
      errors.garden_id = 'Garden is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {lot?.lot_id ? 'Edit Lot' : 'Add New Lot'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {gardensError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {gardensError}
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="lot_number"
              label="Lot Number"
              fullWidth
              value={formData.lot_number}
              onChange={handleTextChange}
              error={!!formErrors.lot_number}
              helperText={formErrors.lot_number}
              disabled={loading}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.garden_id} disabled={loading || gardensLoading}>
              <InputLabel id="garden-label">Garden</InputLabel>
              <Select
                labelId="garden-label"
                name="garden_id"
                value={formData.garden_id || 0}
                onChange={handleGardenChange}
                label="Garden"
                required
              >
                <MenuItem value={0} disabled>
                  <em>Select a garden</em>
                </MenuItem>
                {gardens.map((garden) => (
                  <MenuItem key={garden.garden_id} value={garden.garden_id}>
                    {garden.garden_name} (ID: {garden.garden_id})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.garden_id && (
                <FormHelperText>{formErrors.garden_id}</FormHelperText>
              )}
              {gardensLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="caption">Loading gardens...</Typography>
                </Box>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : lot?.lot_id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LotForm; 