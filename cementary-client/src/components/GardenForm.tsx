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
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select as MuiSelect,
} from '@mui/material';
import axios from 'axios';

interface Cemetery {
  cemetery_id: number;
  cemetery_name: string;
}

interface Garden {
  garden_id?: number;
  garden_name: string;
  cemetery_id: number;
  description: string;
}

interface GardenFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (garden: Garden) => void;
  garden?: Garden;
  loading?: boolean;
  error?: string | null;
}

const initialGarden: Garden = {
  garden_name: '',
  cemetery_id: 0,
  description: '',
};

const GardenForm: React.FC<GardenFormProps> = ({
  open,
  onClose,
  onSubmit,
  garden,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<Garden>(initialGarden);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [cemeteriesLoading, setCemeteriesLoading] = useState(false);

  useEffect(() => {
    if (garden) {
      setFormData({
        ...garden,
      });
    } else {
      setFormData(initialGarden);
    }
  }, [garden, open]);

  useEffect(() => {
    if (open) {
      fetchCemeteries();
    }
  }, [open]);

  const fetchCemeteries = async () => {
    try {
      setCemeteriesLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setFormErrors(prev => ({ ...prev, cemetery_id: 'Authentication token not found. Please log in again.' }));
        setCemeteriesLoading(false);
        return;
      }
      
      const response = await axios.get<Cemetery[]>(`${process.env.REACT_APP_API_URL}/cemeteries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Fetched cemeteries:', response.data);
      setCemeteries(response.data);
      setCemeteriesLoading(false);
    } catch (err: any) {
      console.error('Error fetching cemeteries:', err);
      setFormErrors(prev => ({ ...prev, cemetery_id: 'Failed to load cemeteries data' }));
      setCemeteriesLoading(false);
    }
  };

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

  const handleCemeteryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    console.log('Selected cemetery ID:', value);
    setFormData((prev) => ({ ...prev, cemetery_id: value }));
    
    // Clear error when field is edited
    if (formErrors.cemetery_id) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cemetery_id;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.garden_name.trim()) {
      errors.garden_name = 'Garden name is required';
    }
    
    if (!formData.cemetery_id) {
      errors.cemetery_id = 'Cemetery is required';
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
        {garden?.garden_id ? 'Edit Garden' : 'Add New Garden'}
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
                name="garden_name"
                label="Garden Name"
                value={formData.garden_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                error={!!formErrors.garden_name}
                helperText={formErrors.garden_name}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!formErrors.cemetery_id} disabled={loading}>
                <InputLabel htmlFor="cemetery-select">Cemetery</InputLabel>
                <MuiSelect
                  native
                  value={formData.cemetery_id}
                  onChange={handleCemeteryChange as any}
                  inputProps={{
                    name: 'cemetery_id',
                    id: 'cemetery-select',
                  }}
                  label="Cemetery"
                >
                  <option value={0} disabled>Select a cemetery</option>
                  {cemeteriesLoading ? (
                    <option value={0} disabled>Loading cemeteries...</option>
                  ) : (
                    cemeteries.map((cemetery) => (
                      <option key={cemetery.cemetery_id} value={cemetery.cemetery_id}>
                        {cemetery.cemetery_name}
                      </option>
                    ))
                  )}
                </MuiSelect>
                {formErrors.cemetery_id && (
                  <FormHelperText error>{formErrors.cemetery_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                disabled={loading}
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
          {loading ? 'Saving...' : garden?.garden_id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GardenForm; 