import React, { useState } from 'react';
import { Chip, useTheme, alpha } from '@mui/material';
import EntityManagement from '../components/EntityManagement';

interface MaintenanceTask {
  id: number;
  taskNumber: string;
  title: string;
  description: string;
  location: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
  completedDate: string | null;
  priority: string;
  status: string;
  taskType: string;
  estimatedCost: number;
  actualCost: number | null;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

const Maintenance: React.FC = () => {
  const theme = useTheme();
  
  // Mock data for maintenance tasks
  const [tasks] = useState<MaintenanceTask[]>([
    {
      id: 1,
      taskNumber: 'TASK-2023-001',
      title: 'Lawn Mowing',
      description: 'Regular lawn maintenance for Rose Garden section',
      location: 'Rose Garden, Evergreen Memorial',
      assignedTo: 'John Doe',
      startDate: '2023-05-01',
      dueDate: '2023-05-03',
      completedDate: '2023-05-02',
      priority: 'medium',
      status: 'completed',
      taskType: 'regular',
      estimatedCost: 500,
      actualCost: 450,
    },
    {
      id: 2,
      taskNumber: 'TASK-2023-002',
      title: 'Headstone Repair',
      description: 'Repair damaged headstone at space A-101-2',
      location: 'A-101-2, Rose Garden, Evergreen Memorial',
      assignedTo: 'Mike Smith',
      startDate: '2023-05-05',
      dueDate: '2023-05-10',
      completedDate: '2023-05-09',
      priority: 'high',
      status: 'completed',
      taskType: 'repair',
      estimatedCost: 1200,
      actualCost: 1350,
    },
    {
      id: 3,
      taskNumber: 'TASK-2023-003',
      title: 'Tree Trimming',
      description: 'Trim overgrown trees in Willow Garden section',
      location: 'Willow Garden, Evergreen Memorial',
      assignedTo: 'Sarah Johnson',
      startDate: '2023-05-15',
      dueDate: '2023-05-20',
      completedDate: null,
      priority: 'medium',
      status: 'in_progress',
      taskType: 'regular',
      estimatedCost: 800,
      actualCost: null,
    },
    {
      id: 4,
      taskNumber: 'TASK-2023-004',
      title: 'Drainage System Repair',
      description: 'Fix drainage issues in Oak Garden section',
      location: 'Oak Garden, Peaceful Rest',
      assignedTo: 'Robert Brown',
      startDate: '2023-05-25',
      dueDate: '2023-06-05',
      completedDate: null,
      priority: 'high',
      status: 'scheduled',
      taskType: 'repair',
      estimatedCost: 2500,
      actualCost: null,
    },
    {
      id: 5,
      taskNumber: 'TASK-2023-005',
      title: 'Flower Planting',
      description: 'Plant seasonal flowers in Maple Garden section',
      location: 'Maple Garden, Memorial Gardens',
      assignedTo: 'Emily Davis',
      startDate: '2023-06-01',
      dueDate: '2023-06-03',
      completedDate: null,
      priority: 'low',
      status: 'scheduled',
      taskType: 'regular',
      estimatedCost: 600,
      actualCost: null,
    },
  ]);

  const columns: Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'taskNumber', label: 'Task #', minWidth: 150 },
    { id: 'title', label: 'Title', minWidth: 180 },
    { id: 'location', label: 'Location', minWidth: 200 },
    { id: 'assignedTo', label: 'Assigned To', minWidth: 150 },
    { id: 'dueDate', label: 'Due Date', minWidth: 120 },
    { 
      id: 'priority', 
      label: 'Priority', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'high':
            color = theme.palette.error.main;
            break;
          case 'medium':
            color = theme.palette.warning.main;
            break;
          case 'low':
            color = theme.palette.success.main;
            break;
          default:
            color = theme.palette.info.main;
        }
        
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
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label;
        
        switch (value) {
          case 'completed':
            color = theme.palette.success.main;
            label = 'Completed';
            break;
          case 'in_progress':
            color = theme.palette.warning.main;
            label = 'In Progress';
            break;
          case 'scheduled':
            color = theme.palette.info.main;
            label = 'Scheduled';
            break;
          case 'cancelled':
            color = theme.palette.error.main;
            label = 'Cancelled';
            break;
          default:
            color = theme.palette.primary.main;
            label = value.charAt(0).toUpperCase() + value.slice(1);
        }
        
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
    { 
      id: 'taskType', 
      label: 'Type', 
      minWidth: 120,
      format: (value: string) => {
        let color;
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        switch (value) {
          case 'regular':
            color = theme.palette.primary.main;
            break;
          case 'repair':
            color = theme.palette.secondary.main;
            break;
          case 'emergency':
            color = theme.palette.error.main;
            break;
          default:
            color = theme.palette.info.main;
        }
        
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
    { 
      id: 'estimatedCost', 
      label: 'Est. Cost ($)', 
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
  ];

  const handleAddTask = () => {
    console.log('Add maintenance task');
    // In a real application, this would open a modal or navigate to a form
  };

  const handleEditTask = (id: number) => {
    console.log('Edit maintenance task with ID:', id);
    // In a real application, this would open a modal or navigate to a form
  };

  const handleDeleteTask = (id: number) => {
    console.log('Delete maintenance task with ID:', id);
    // In a real application, this would show a confirmation dialog
  };

  const handleViewTask = (id: number) => {
    console.log('View maintenance task with ID:', id);
    // In a real application, this would navigate to a task details page
  };

  return (
    <EntityManagement
      title="Maintenance Management"
      subtitle="Manage cemetery maintenance tasks and activities"
      columns={columns}
      data={tasks}
      onAdd={handleAddTask}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
      onView={handleViewTask}
    />
  );
};

export default Maintenance; 