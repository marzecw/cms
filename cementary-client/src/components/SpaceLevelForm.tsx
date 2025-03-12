import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  Paper,
  Grid,
  FormHelperText,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { SpaceLevel } from '../services/space-level.service';
import SpaceService from '../services/space.service';

interface SpaceLevelFormProps {
  initialData?: SpaceLevel;
  onSubmit: (data: SpaceLevel) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const SpaceLevelForm: React.FC<SpaceLevelFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<SpaceLevel>({
    name: '',
    description: '',
    price: 0,
    status: 'available',
    space_id: 0,
    ...(initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      status: initialData.status || 'available',
      space_id: initialData.space_id
    } : {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [spaces, setSpaces] = useState<any[]>([]);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  
  const spaceService = SpaceService;

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const spacesData = await spaceService.getSpaces();
        console.log('Fetched spaces:', spacesData);
        setSpaces(spacesData);
        if (spacesData.length === 0) {
          setSpacesError('No spaces available. Please create a space first.');
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
        setSpacesError('Failed to load spaces. Please try again later.');
      }
    };

    fetchSpaces();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    if (!name) return;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is updated
    if (errors[name as string]) {
      setErrors({
        ...errors,
        [name as string]: ''
      });
    }
  };

  const handleSpaceChange = (e: SelectChangeEvent<number>) => {
    const spaceId = Number(e.target.value);
    console.log('Selected space ID:', spaceId);
    
    setFormData({
      ...formData,
      space_id: spaceId
    });

    if (errors.space_id) {
      setErrors({
        ...errors,
        space_id: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.space_id) {
      newErrors.space_id = 'Space is required';
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
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Space Level' : 'Add New Space Level'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.space_id}>
              <InputLabel id="space-select-label">Space</InputLabel>
              <Select
                labelId="space-select-label"
                id="space-select"
                name="space_id"
                value={formData.space_id || 0}
                onChange={handleSpaceChange}
                label="Space"
              >
                <MenuItem value={0} disabled>Select a space</MenuItem>
                {spaces.map((space) => (
                  <MenuItem key={space.space_id} value={space.space_id}>
                    {space.space_number} (Lot: {space.lot?.lot_number || 'N/A'})
                  </MenuItem>
                ))}
              </Select>
              {errors.space_id && <FormHelperText>{errors.space_id}</FormHelperText>}
              {spacesError && <FormHelperText error>{spacesError}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                name="status"
                value={formData.status || 'available'}
                onChange={handleSelectChange}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEdit ? 'Update' : 'Create'} Space Level
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SpaceLevelForm; 