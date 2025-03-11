import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, Snackbar, Alert, Box, Button, CircularProgress } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import TenantService, { TenantResponse } from '../services/tenant.service';
import { format } from 'date-fns';

interface Tenant {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

const Tenants: React.FC = () => {
  const theme = useTheme();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch tenants from the database
  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const tenantsData = await TenantService.getTenants();
      console.log('Raw tenant data from API:', tenantsData);
      
      // Map the API response to the Tenant interface
      const formattedTenants = tenantsData.map((tenant: TenantResponse) => ({
        id: tenant.tenant_id,
        name: tenant.tenant_name,
        address: 'N/A', // These fields don't exist in the API response
        city: 'N/A',    // You may want to update your database schema
        state: 'N/A',   // or adjust the UI to match the available data
        zipCode: 'N/A',
        phone: tenant.contact_phone || 'N/A',
        email: tenant.contact_email || 'N/A',
        status: 'active', // Assuming all tenants are active
        createdAt: tenant.created_at ? format(new Date(tenant.created_at), 'yyyy-MM-dd') : 'N/A',
      }));
      
      console.log('Formatted tenants for display:', formattedTenants);
      setTenants(formattedTenants);
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      setSnackbar({
        open: true,
        message: `Failed to fetch tenants: ${error.message || 'Unknown error'}`,
        severity: 'error',
      });
      // Keep the UI usable with empty data
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tenants when component mounts
  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 180 },
    { id: 'city', label: 'City', minWidth: 120 },
    { id: 'state', label: 'State', minWidth: 80 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => (
        <Chip 
          label={value.charAt(0).toUpperCase() + value.slice(1)} 
          size="small"
          sx={{ 
            bgcolor: value === 'active' 
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.error.main, 0.1),
            color: value === 'active' 
              ? theme.palette.success.main
              : theme.palette.error.main,
            fontWeight: 'medium',
          }}
        />
      )
    },
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
  ];

  const handleAddTenant = () => {
    console.log('Add tenant');
    // In a real application, this would open a modal or navigate to a form
    // For now, we'll just show a message
    setSnackbar({
      open: true,
      message: 'Tenant creation form would open here',
      severity: 'info',
    });
  };

  const handleEditTenant = (id: number) => {
    console.log('Edit tenant with ID:', id);
    // In a real application, this would open a modal or navigate to a form
    // For now, we'll just show a message
    setSnackbar({
      open: true,
      message: `Tenant edit form for ID ${id} would open here`,
      severity: 'info',
    });
  };

  const handleDeleteTenant = (id: number) => {
    console.log('Delete tenant with ID:', id);
    // In a real application, this would show a confirmation dialog
    // For now, we'll just show a message
    setSnackbar({
      open: true,
      message: `Confirmation dialog for deleting tenant ID ${id} would open here`,
      severity: 'info',
    });
  };

  const handleViewTenant = (id: number) => {
    console.log('View tenant with ID:', id);
    // In a real application, this would navigate to a tenant details page
    // For now, we'll just show a message
    setSnackbar({
      open: true,
      message: `Details page for tenant ID ${id} would open here`,
      severity: 'info',
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={fetchTenants} 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Tenants'}
        </Button>
      </Box>
      <EntityManagement
        title=""
        subtitle="Manage cemetery organizations and their properties"
        columns={columns}
        data={tenants}
        onAdd={handleAddTenant}
        onEdit={handleEditTenant}
        onDelete={handleDeleteTenant}
        onView={handleViewTenant}
      />
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Tenants; 