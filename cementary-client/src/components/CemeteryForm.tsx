import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Cemetery {
  cemetery_id?: number;
  cemetery_name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  established_date: Date | null;
}

interface CemeteryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cemetery: Cemetery) => void;
  cemetery?: Cemetery;
  loading?: boolean;
  error?: string | null;
}

const initialCemetery: Cemetery = {
  cemetery_name: '',
  address: '',
  city: '',
  state: '',
  country: '',
  established_date: null,
};

const CemeteryForm: React.FC<CemeteryFormProps> = ({
  open,
  onClose,
  onSubmit,
  cemetery,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<Cemetery>(initialCemetery);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cemetery) {
      setFormData({
        ...cemetery,
        established_date: cemetery.established_date ? new Date(cemetery.established_date) : null,
      });
    } else {
      setFormData(initialCemetery);
    }
  }, [cemetery, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setFormData((prev) => ({ ...prev, established_date: date }));
    
    // Clear error when date is edited
    if (formErrors.established_date) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.established_date;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.cemetery_name.trim()) {
      errors.cemetery_name = 'Cemetery name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {cemetery?.cemetery_id ? 'Edit Cemetery' : 'Add New Cemetery'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="cemetery_name"
                label="Cemetery Name"
                value={formData.cemetery_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!formErrors.cemetery_name}
                helperText={formErrors.cemetery_name}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="state"
                label="State/Province"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="established_date"
                label="Established Date"
                type="date"
                value={formData.established_date ? formData.established_date.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                fullWidth
                margin="normal"
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : cemetery?.cemetery_id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CemeteryForm; 