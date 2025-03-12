import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, Snackbar, Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import CustomerService, { CustomerResponse, Customer } from '../services/customer.service';
import { format } from 'date-fns';
import CustomerForm from '../components/CustomerForm';
import ConfirmationDialog from '../components/ConfirmationDialog';

interface CustomerDisplay {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  createdAt: string;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
  sortable?: boolean;
}

const Customers: React.FC = () => {
  const theme = useTheme();
  const [customers, setCustomers] = useState<CustomerDisplay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    customerId: number | null;
    customerName: string;
  }>({
    open: false,
    customerId: null,
    customerName: '',
  });
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch customers from the database
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const customersData = await CustomerService.getCustomers();
      console.log('Raw customer data from API:', customersData);
      
      // Map the API response to the Customer interface
      const formattedCustomers = customersData.map((customer: CustomerResponse) => ({
        id: customer.customer_id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email || 'N/A',
        phone: customer.phone || 'N/A',
        address: customer.address || 'N/A',
        city: customer.city || 'N/A',
        state: customer.state || 'N/A',
        zipCode: customer.country || 'N/A', // Using country as zipCode since zipCode doesn't exist in the API
        status: 'active', // Assuming all customers are active
        createdAt: customer.created_at ? format(new Date(customer.created_at), 'yyyy-MM-dd') : 'N/A',
      }));
      
      console.log('Formatted customers for display:', formattedCustomers);
      setCustomers(formattedCustomers);
      
      setSnackbar({
        open: true,
        message: `Successfully loaded ${formattedCustomers.length} customers from the database`,
        severity: 'success',
      });
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setError(error.response?.data?.message || 'Failed to fetch customers');
      
      setSnackbar({
        open: true,
        message: `Error fetching customers: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { 
      id: 'fullName', 
      label: 'Name', 
      minWidth: 180,
      sortable: true,
      format: (value: any, row: any) => {
        if (!row || !row.firstName || !row.lastName) return 'N/A';
        return `${row.firstName} ${row.lastName}`;
      },
    },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true },
    { id: 'phone', label: 'Phone', minWidth: 150, sortable: true },
    { 
      id: 'location', 
      label: 'Location', 
      minWidth: 180,
      sortable: true,
      format: (value: any, row: any) => {
        if (!row || !row.city || !row.state) return 'N/A';
        return `${row.city}, ${row.state}`;
      },
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => {
        if (!value) return 'N/A';
        let color = value === 'active' ? theme.palette.success.main : theme.palette.error.main;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
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
    { id: 'createdAt', label: 'Created At', minWidth: 120, sortable: true },
  ];

  const handleAddCustomer = () => {
    setSelectedCustomer(undefined);
    setFormError(null);
    setFormOpen(true);
  };

  const handleEditCustomer = (id: number) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      // Convert display customer to form data
      const formData: Customer = {
        customer_id: customer.id,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email !== 'N/A' ? customer.email : '',
        phone: customer.phone !== 'N/A' ? customer.phone : '',
        address: customer.address !== 'N/A' ? customer.address : '',
        city: customer.city !== 'N/A' ? customer.city : '',
        state: customer.state !== 'N/A' ? customer.state : '',
        country: customer.zipCode !== 'N/A' ? customer.zipCode : '',
      };
      setSelectedCustomer(formData);
      setFormError(null);
      setFormOpen(true);
    }
  };

  const handleDeleteCustomer = (id: number) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setConfirmDialog({
        open: true,
        customerId: id,
        customerName: `${customer.firstName} ${customer.lastName}`,
      });
    }
  };

  const confirmDeleteCustomer = async () => {
    if (confirmDialog.customerId) {
      try {
        setIsLoading(true);
        await CustomerService.deleteCustomer(confirmDialog.customerId);
        
        // Remove the deleted customer from the state
        setCustomers(customers.filter(customer => customer.id !== confirmDialog.customerId));
        
        setSnackbar({
          open: true,
          message: 'Customer deleted successfully',
          severity: 'success',
        });
      } catch (err: any) {
        console.error('Error deleting customer:', err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to delete customer',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    }
  };

  const handleViewCustomer = (id: number) => {
    // In a real application, this would navigate to a customer details page
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setSnackbar({
        open: true,
        message: `Viewing details for ${customer.firstName} ${customer.lastName}`,
        severity: 'info',
      });
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setFormError(null);
  };

  const handleFormSubmit = async (formData: Customer) => {
    try {
      setFormLoading(true);
      setFormError(null);
      
      if (formData.customer_id) {
        // Update existing customer
        const customerId = formData.customer_id;
        console.log('Updating customer with ID:', customerId);
        console.log('Update data:', formData);
        
        const updatedCustomer = await CustomerService.updateCustomer(customerId, formData);
        console.log('Customer updated successfully:', updatedCustomer);
        
        // Refresh the customers data
        await fetchCustomers();
        
        setSnackbar({
          open: true,
          message: 'Customer updated successfully',
          severity: 'success',
        });
      } else {
        // Create new customer
        console.log('Creating new customer with data:', formData);
        
        const newCustomer = await CustomerService.createCustomer(formData);
        console.log('Customer created successfully:', newCustomer);
        
        // Refresh the customers data
        await fetchCustomers();
        
        setSnackbar({
          open: true,
          message: 'Customer created successfully',
          severity: 'success',
        });
      }
      
      // Close the form
      setFormOpen(false);
    } catch (err: any) {
      console.error('Error saving customer:', err);
      setFormError(err.response?.data?.message || 'Failed to save customer');
      
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to save customer',
        severity: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading && customers.length === 0) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={48} thickness={4} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading customers...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={fetchCustomers} 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          color="primary"
          sx={{ mr: 1 }}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Customers'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCustomer}
          disabled={isLoading}
        >
          Add Customer
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <EntityManagement
        title=""
        subtitle="Manage customer information and relationships"
        columns={columns}
        data={customers}
        onAdd={handleAddCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onView={handleViewCustomer}
        error={error}
      />
      
      <CustomerForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
        loading={formLoading}
        error={formError}
      />
      
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Delete Customer"
        message={`Are you sure you want to delete the customer "${confirmDialog.customerName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteCustomer}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        isLoading={isLoading}
        severity="error"
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

export default Customers; 