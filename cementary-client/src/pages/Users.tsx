import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for users
  const [users] = useState<User[]>([
    {
      id: 1,
      username: 'admin',
      email: 'admin@cemetery.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      createdAt: '2023-01-15',
    },
    {
      id: 2,
      username: 'manager',
      email: 'manager@cemetery.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'manager',
      status: 'active',
      createdAt: '2023-02-20',
    },
    {
      id: 3,
      username: 'staff1',
      email: 'staff1@cemetery.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'staff',
      status: 'active',
      createdAt: '2023-03-10',
    },
    {
      id: 4,
      username: 'staff2',
      email: 'staff2@cemetery.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: 'staff',
      status: 'inactive',
      createdAt: '2023-04-05',
    },
    {
      id: 5,
      username: 'viewer',
      email: 'viewer@cemetery.com',
      firstName: 'Emily',
      lastName: 'Brown',
      role: 'viewer',
      status: 'active',
      createdAt: '2023-05-12',
    },
  ]);

  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'username', label: 'Username', minWidth: 120 },
    { id: 'firstName', label: 'First Name', minWidth: 120 },
    { id: 'lastName', label: 'Last Name', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 180 },
    { 
      id: 'role', 
      label: 'Role', 
      minWidth: 120,
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

  const handleAddUser = () => {
    console.log('Add user');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditUser = (id: number) => {
    console.log('Edit user with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteUser = (id: number) => {
    console.log('Delete user with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewUser = (id: number) => {
    console.log('View user with ID:', id);
    // In a real application, this would navigate to a user details page
  };

  return (
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
  );
};

export default Users; 