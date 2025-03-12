import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import LotService from '../services/lot.service';
import { CreateSpaceDto, UpdateSpaceDto } from '../services/space.service';

interface SpaceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateSpaceDto | UpdateSpaceDto) => void;
  space?: {
    space_id?: number;
    space_number: string;
    lot_id: number;
    type?: string;
    price?: number;
    status?: string;
  };
  loading: boolean;
  error: string | null;
}

interface Lot {
  id: number;
  lotNumber: string;
  gardenName: string;
  cemeteryName: string;
}

const SpaceForm: React.FC<SpaceFormProps> = ({
  open,
  onClose,
  onSubmit,
  space,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<CreateSpaceDto & { space_number: string; price: number }>({
    space_number: '',
    lot_id: 0,
    type: 'standard',
    price: 0,
    status: 'available',
  });

  const [formErrors, setFormErrors] = useState<{
    space_number?: string;
    lot_id?: string;
    price?: string;
  }>({});

  const [lots, setLots] = useState<Lot[]>([]);
  const [lotsLoading, setLotsLoading] = useState(false);
  const [lotsError, setLotsError] = useState<string | null>(null);

  // Load lots when the form opens
  useEffect(() => {
    if (open) {
      fetchLots();
    }
  }, [open]);

  // Set form data when space prop changes
  useEffect(() => {
    if (space) {
      setFormData({
        space_number: space.space_number,
        lot_id: space.lot_id,
        type: space.type || 'standard',
        price: space.price !== undefined ? Number(space.price) : 0,
        status: space.status || 'available',
      });
    } else {
      // Reset form for new space
      setFormData({
        space_number: '',
        lot_id: 0,
        type: 'standard',
        price: 0,
        status: 'available',
      });
    }
    // Reset errors when space changes
    setFormErrors({});
  }, [space]);

  const fetchLots = async () => {
    try {
      setLotsLoading(true);
      setLotsError(null);
      console.log('Fetching lots...');
      
      const lotsData = await LotService.getLots();
      console.log('Lots data from API:', lotsData);
      
      if (!lotsData || lotsData.length === 0) {
        console.warn('No lots returned from API');
        setLotsError('No lots available. Please create a lot first.');
        setLotsLoading(false);
        return;
      }
      
      // Transform the API response to match our component's data structure
      const formattedLots = lotsData.map((lot: any) => {
        console.log('Processing lot:', lot);
        return {
          id: lot.lot_id,
          lotNumber: lot.lot_number,
          gardenName: lot.garden?.garden_name || 'N/A',
          cemeteryName: lot.garden?.cemetery?.cemetery_name || 'N/A',
        };
      });
      
      console.log('Formatted lots:', formattedLots);
      setLots(formattedLots);
      setLotsLoading(false);
    } catch (err) {
      console.error('Error fetching lots:', err);
      setLotsError('Failed to load lots. Please try again.');
      setLotsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setFormData({ ...formData, [name]: numValue });
    } else if (value === '') {
      setFormData({ ...formData, [name]: 0 });
    }
    
    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  const handleLotChange = (e: SelectChangeEvent<number>) => {
    const value = e.target.value;
    console.log('Selected lot ID:', value);
    
    setFormData({ ...formData, lot_id: Number(value) });
    
    // Clear error for lot_id
    if (formErrors.lot_id) {
      setFormErrors({ ...formErrors, lot_id: undefined });
    }
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const validateForm = (): boolean => {
    const errors: { space_number?: string; lot_id?: string; price?: string } = {};
    let isValid = true;

    if (!formData.space_number.trim()) {
      errors.space_number = 'Space number is required';
      isValid = false;
    }

    if (!formData.lot_id || formData.lot_id === 0) {
      errors.lot_id = 'Please select a lot';
      isValid = false;
    }

    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Ensure price is sent as a number
      const submissionData = {
        ...formData,
        price: Number(formData.price)
      };
      onSubmit(submissionData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{space?.space_id ? 'Edit Space' : 'Add New Space'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          margin="dense"
          label="Space Number"
          name="space_number"
          value={formData.space_number}
          onChange={handleInputChange}
          fullWidth
          required
          error={!!formErrors.space_number}
          helperText={formErrors.space_number}
          disabled={loading}
          sx={{ mb: 2, mt: 1 }}
        />

        <FormControl fullWidth error={!!formErrors.lot_id || !!lotsError} sx={{ mb: 2 }}>
          <InputLabel id="lot-select-label">Lot</InputLabel>
          <Select
            labelId="lot-select-label"
            id="lot-select"
            value={formData.lot_id || 0}
            onChange={handleLotChange}
            label="Lot"
            disabled={loading || lotsLoading}
          >
            <MenuItem value={0} disabled>
              <em>Select a lot</em>
            </MenuItem>
            {lots.map((lot) => (
              <MenuItem key={lot.id} value={lot.id}>
                {lot.lotNumber} - {lot.gardenName} ({lot.cemeteryName})
              </MenuItem>
            ))}
          </Select>
          {formErrors.lot_id && <FormHelperText>{formErrors.lot_id}</FormHelperText>}
          {lotsError && <FormHelperText error>{lotsError}</FormHelperText>}
          {lotsLoading && (
            <CircularProgress size={20} sx={{ position: 'absolute', right: 30, top: 15 }} />
          )}
          {lots.length === 0 && !lotsLoading && !lotsError && (
            <FormHelperText>No lots available. Please create a lot first.</FormHelperText>
          )}
          <Button 
            size="small" 
            onClick={fetchLots} 
            disabled={lotsLoading}
            sx={{ mt: 1 }}
          >
            Refresh Lots
          </Button>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={formData.type || 'standard'}
            onChange={handleTypeChange}
            label="Type"
            disabled={loading}
          >
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
            <MenuItem value="mausoleum">Mausoleum</MenuItem>
            <MenuItem value="cremation">Cremation</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleNumberInputChange}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          error={!!formErrors.price}
          helperText={formErrors.price}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={formData.status || 'available'}
            onChange={handleStatusChange}
            label="Status"
            disabled={loading}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="occupied">Occupied</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </Select>
        </FormControl>
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
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpaceForm; 