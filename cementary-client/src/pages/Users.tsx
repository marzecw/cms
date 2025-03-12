import React, { useState, useEffect } from 'react';
import { Chip, useTheme, alpha, Snackbar, Alert } from '@mui/material';
import EntityManagement from '../components/EntityManagement';
import UserForm from '../components/UserForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import UserService, { User, UserResponse } from '../services/user.service';
import TenantService, { TenantResponse } from '../services/tenant.service';
import { format } from 'date-fns';

interface FormattedUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  tenantId: number;
  tenantName?: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<FormattedUser[]>([]);
  const [tenants, setTenants] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: number | null;
    username: string;
  }>({
    open: false,
    userId: null,
    username: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await UserService.getUsers();
      const formattedUsers = usersData.map(formatUser);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultTenant = async () => {
    try {
      const defaultTenant = {
        tenant_name: 'Main Cemetery',
        db_name: 'main_cemetery',
        contact_email: 'admin@cemetery.com',
        contact_phone: '555-123-4567'
      };
      
      const newTenant = await TenantService.createTenant(defaultTenant);
      setTenants([{ id: newTenant.tenant_id, name: newTenant.tenant_name }]);
      
      setSnackbar({
        open: true,
        message: 'Created default tenant',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating default tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create default tenant',
        severity: 'error',
      });
    }
  };

  const fetchTenants = async () => {
    try {
      const tenantsData = await TenantService.getTenants();
      console.log('Raw tenant data from API:', tenantsData);
      
      const formattedTenants = tenantsData.map((tenant) => ({
        id: tenant.tenant_id,
        name: tenant.tenant_name,
      }));
      console.log('Formatted tenants for dropdown:', formattedTenants);
      
      if (formattedTenants.length === 0) {
        // If no tenants are returned from the API, create a default tenant
        console.warn('No tenants found from API, creating default tenant');
        await createDefaultTenant();
      } else {
        setTenants(formattedTenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      // Use mock data for testing when API fails
      const mockTenants = [
        { id: 1, name: 'Main Cemetery' },
        { id: 2, name: 'Memorial Park' },
        { id: 3, name: 'Sunset Gardens' },
      ];
      console.log('Using mock tenant data:', mockTenants);
      setTenants(mockTenants);
      setSnackbar({
        open: true,
        message: 'Failed to fetch tenants, using mock data',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTenants();
  }, []);

  // Debug tenants data
  useEffect(() => {
    console.log('Tenants in Users component:', tenants);
  }, [tenants]);

  const formatUser = (user: UserResponse): FormattedUser => {
    const tenant = tenants.find((t) => t.id === user.tenant_id);
    
    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.is_active ? 'active' : 'inactive',
      tenantId: user.tenant_id,
      tenantName: tenant?.name,
      createdAt: user.created_at ? format(new Date(user.created_at), 'yyyy-MM-dd') : '',
    };
  };

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50, sortable: true },
    { id: 'username', label: 'Username', minWidth: 120, sortable: true },
    { id: 'firstName', label: 'First Name', minWidth: 120, sortable: true },
    { id: 'lastName', label: 'Last Name', minWidth: 120, sortable: true },
    { id: 'email', label: 'Email', minWidth: 180, sortable: true },
    { 
      id: 'role', 
      label: 'Role', 
      minWidth: 120,
      sortable: true,
      format: (value: string) => {
        let color;
        switch (value) {
          case 'admin':
            color = theme.palette.error.main;
            break;
          case 'manager':
            color = theme.palette.warning.main;
            break;
          case 'staff':
            color = theme.palette.info.main;
            break;
          default:
            color = theme.palette.success.main;
        }
        
        return (
          <Chip 
            label={value.charAt(0).toUpperCase() + value.slice(1)} 
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
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      sortable: true,
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
    { id: 'createdAt', label: 'Created At', minWidth: 120, sortable: true },
  ];

  const handleAddUser = () => {
    if (tenants.length === 0) {
      // If no tenants are available, fetch them again and show a message
      fetchTenants();
      setSnackbar({
        open: true,
        message: 'Loading tenants data...',
        severity: 'info',
      });
      return;
    }
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = async (id: number) => {
    if (tenants.length === 0) {
      // If no tenants are available, fetch them again and show a message
      fetchTenants();
      setSnackbar({
        open: true,
        message: 'Loading tenants data...',
        severity: 'info',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const user = await UserService.getUser(id);
      setSelectedUser(user);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error fetching user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch user details',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setConfirmDialog({
        open: true,
        userId: id,
        username: user.username,
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (confirmDialog.userId) {
      setIsLoading(true);
      try {
        await UserService.deleteUser(confirmDialog.userId);
        setUsers(users.filter(user => user.id !== confirmDialog.userId));
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete user',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    }
  };

  const handleViewUser = (id: number) => {
    handleEditUser(id);
  };

  const handleFormSubmit = async (userData: User) => {
    setIsLoading(true);
    try {
      if (selectedUser) {
        // Update existing user
        console.log('Updating user with ID:', selectedUser.user_id);
        
        // If password is empty, don't send it
        const updateData = { ...userData };
        if (!updateData.password) {
          delete updateData.password;
        }
        
        console.log('Update payload (before service):', updateData);
        
        const updatedUser = await UserService.updateUser(selectedUser.user_id!, updateData);
        console.log('Update response:', updatedUser);
        
        setUsers(users.map(user => 
          user.id === updatedUser.user_id ? formatUser(updatedUser) : user
        ));
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      } else {
        // Create new user
        console.log('Creating new user with payload:', userData);
        
        const newUser = await UserService.createUser(userData);
        console.log('Create response:', newUser);
        
        setUsers([...users, formatUser(newUser)]);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success',
        });
      }
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Error saving user:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      setSnackbar({
        open: true,
        message: `Failed to ${selectedUser ? 'update' : 'create'} user: ${error.response?.data?.message || error.message || 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshTenants = async () => {
    try {
      await fetchTenants();
    } catch (error) {
      console.error('Error refreshing tenants:', error);
    }
  };

  const handleCreateTenant = async () => {
    try {
      await createDefaultTenant();
      await fetchTenants();
    } catch (error) {
      console.error('Error creating default tenant:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <EntityManagement
        title=""
        subtitle="Manage system users and their permissions"
        columns={columns}
        data={users}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />
      
      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={isLoading}
        tenants={tenants}
        onCreateTenant={handleCreateTenant}
        onRefreshTenants={handleRefreshTenants}
      />
      
      <ConfirmationDialog
        open={confirmDialog.open}
        title="Delete User"
        message={`Are you sure you want to delete the user "${confirmDialog.username}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDeleteUser}
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Users; 