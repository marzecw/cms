import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import { Customer } from '../services/customer.service';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Customer) => Promise<void>;
  customer?: {
    customer_id?: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  loading: boolean;
  error: string | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  onSubmit,
  customer,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<Customer>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Set form data when customer prop changes
  useEffect(() => {
    if (customer) {
      setFormData({
        ...(customer.customer_id ? { customer_id: customer.customer_id } : {}),
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        country: customer.country || '',
      });
    } else {
      // Reset form for new customer
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
      });
    }
    // Reset errors when customer changes
    setFormErrors({});
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create a copy of the form data to submit
      const submitData: Customer = {
        ...formData,
      };
      
      // If this is an update, ensure customer_id is included
      if (customer?.customer_id) {
        submitData.customer_id = customer.customer_id;
      }
      
      onSubmit(submitData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          overflow: 'hidden'
        } 
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Typography variant="h6">
          {customer?.customer_id ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.first_name}
              helperText={formErrors.first_name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!formErrors.last_name}
              helperText={formErrors.last_name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="state"
              label="State/Province"
              value={formData.state}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          color="inherit" 
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Saving...' : customer?.customer_id ? 'Update Customer' : 'Add Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm; 