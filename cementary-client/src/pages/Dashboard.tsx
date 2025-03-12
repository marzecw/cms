import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  PeopleOutlined,
  AccountBalance,
  EventNote,
  Person,
  Assignment,
  Receipt,
  Payment,
  Spa,
  GridOn,
  ViewModule,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import DashboardService, { DashboardStats } from '../services/dashboard.service';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Avatar
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value.toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch real data from the API
        const dashboardStats = await DashboardService.getStats();
        console.log('Dashboard stats from API:', dashboardStats);
        
        setStats(dashboardStats);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={48} thickness={4} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We're having trouble loading your dashboard data. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No dashboard data available
        </Alert>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We couldn't find any data for your dashboard. Please check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your cemetery management system today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Cemeteries" 
            value={stats.cemeteries} 
            icon={<AccountBalance />} 
            color={theme.palette.primary.main} 
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Gardens" 
            value={stats.gardens} 
            icon={<Spa />} 
            color={theme.palette.success.main} 
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Lots" 
            value={stats.lots} 
            icon={<GridOn />} 
            color={theme.palette.info.main} 
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Spaces" 
            value={stats.spaces} 
            icon={<ViewModule />} 
            color={theme.palette.warning.main} 
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Key Metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Cemetery Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ '& > div': { mb: 2 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 32, height: 32, mr: 1.5 }}>
                      <AccountBalance fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Cemeteries</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.cemeteries}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 32, height: 32, mr: 1.5 }}>
                      <Spa fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Gardens</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.gardens}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 32, height: 32, mr: 1.5 }}>
                      <GridOn fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Lots</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.lots}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 32, height: 32, mr: 1.5 }}>
                      <ViewModule fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Spaces</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.spaces}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Customer Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ '& > div': { mb: 2 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, width: 32, height: 32, mr: 1.5 }}>
                      <PeopleOutlined fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Customers</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.customers}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 32, height: 32, mr: 1.5 }}>
                      <EventNote fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Reservations</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.reservations}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main, width: 32, height: 32, mr: 1.5 }}>
                      <Person fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Deceased</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.deceased}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 32, height: 32, mr: 1.5 }}>
                      <Assignment fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Interments</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.interments}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Financial Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ '& > div': { mb: 2 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 32, height: 32, mr: 1.5 }}>
                      <Receipt fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Invoices</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.invoices}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 32, height: 32, mr: 1.5 }}>
                      <Payment fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Payments</Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">{stats.payments}</Typography>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>
                  Financial Summary
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body2" color="text.secondary">Total Invoiced:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ${stats.financialSummary?.totalInvoiced.toLocaleString() || '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body2" color="text.secondary">Total Received:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ${stats.financialSummary?.totalReceived.toLocaleString() || '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body2" color="text.secondary">Outstanding:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    ${stats.financialSummary?.outstanding.toLocaleString() || '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 