import React, { useState, useEffect, ReactNode } from 'react';
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
  Grid,
  Switch,
  FormControlLabel,
  CircularProgress,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { Visibility, VisibilityOff, Refresh as RefreshIcon } from '@mui/icons-material';
import { User } from '../services/user.service';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  user?: User;
  isLoading?: boolean;
  tenants: { id: number; name: string }[];
  onCreateTenant?: () => Promise<void>;
  onRefreshTenants?: () => Promise<void>;
}

const initialUser: User = {
  tenant_id: 0,
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: 'user',
  is_active: true,
};

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  isLoading = false,
  tenants,
  onCreateTenant,
  onRefreshTenants,
}) => {
  // Set initial tenant_id to the first tenant's ID if available
  const initialUserWithTenant = {
    ...initialUser,
    tenant_id: tenants && tenants.length > 0 ? tenants[0].id : 0,
  };

  const [formData, setFormData] = useState<User>(initialUserWithTenant);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Don't populate password field for security
      });
    } else {
      setFormData(initialUserWithTenant);
    }
  }, [user, tenants]);

  // Debug tenants data
  useEffect(() => {
    console.log('Tenants in UserForm:', tenants);
    console.log('Tenant dropdown options:', tenants.map(t => ({ id: t.id, name: t.name })));
  }, [tenants]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: name === 'tenant_id' ? Number(value) : value,
    });
    
    // Clear error when field is edited
    if (name && errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tenant_id || formData.tenant_id <= 0) {
      newErrors.tenant_id = 'Tenant is required';
    }
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // For new users, password is required
    // For existing users, if password field is not empty, it must be at least 6 characters
    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.tenant_id} margin="normal">
                <InputLabel id="tenant-label">Tenant</InputLabel>
                <Select
                  labelId="tenant-label"
                  id="tenant_id"
                  name="tenant_id"
                  value={formData.tenant_id > 0 ? formData.tenant_id.toString() : ''}
                  onChange={handleSelectChange}
                  label="Tenant"
                  disabled={isLoading}
                  endAdornment={
                    onRefreshTenants && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onRefreshTenants();
                          }}
                          edge="end"
                          size="small"
                          sx={{ mr: 2 }}
                          disabled={isLoading}
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  <MenuItem value="" disabled>
                    Select a tenant
                  </MenuItem>
                  {tenants && tenants.length > 0 ? (
                    tenants.map((tenant) => (
                      <MenuItem key={tenant.id} value={tenant.id.toString()}>
                        {tenant.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No tenants available
                    </MenuItem>
                  )}
                </Select>
                {errors.tenant_id && <FormHelperText>{errors.tenant_id}</FormHelperText>}
                {tenants.length === 0 && (
                  <FormHelperText error>
                    No tenants available. Please create a tenant first.
                    {onCreateTenant && (
                      <Button
                        size="small"
                        onClick={onCreateTenant}
                        sx={{ ml: 1 }}
                        disabled={isLoading}
                      >
                        Create Default Tenant
                      </Button>
                    )}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role} margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleSelectChange}
                  label="Role"
                  disabled={isLoading}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="username"
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleTextFieldChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleTextFieldChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="first_name"
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={handleTextFieldChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={handleTextFieldChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={isLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label={user ? 'New Password (leave blank to keep current)' : 'Password'}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleTextFieldChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleSwitchChange}
                    name="is_active"
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label="Active"
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {user ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm; 