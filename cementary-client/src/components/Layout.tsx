import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  alpha,
  Tooltip,
  Badge,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as CemeteryIcon,
  Spa as GardenIcon,
  GridOn as LotIcon,
  ViewModule as SpaceIcon,
  Layers as LevelIcon,
  EventNote as ReservationIcon,
  Person as DeceasedIcon,
  Assignment as IntermentIcon,
  Receipt as BillingIcon,
  Payment as PaymentIcon,
  Build as MaintenanceIcon,
  Logout as LogoutIcon,
  AccountBalance,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
  Inventory as InventoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
}

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAssets, setOpenAssets] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setDrawerCollapsed(!drawerCollapsed);
  };

  const handleAssetsClick = () => {
    if (drawerCollapsed) {
      setDrawerCollapsed(false);
      setTimeout(() => {
        setOpenAssets(!openAssets);
      }, 300);
    } else {
      setOpenAssets(!openAssets);
    }
  };

  const assetItems: MenuItem[] = [
    { text: 'Cemeteries', icon: <CemeteryIcon />, path: '/cemeteries' },
    { text: 'Gardens', icon: <GardenIcon />, path: '/gardens' },
    { text: 'Lots', icon: <LotIcon />, path: '/lots' },
    { text: 'Spaces', icon: <SpaceIcon />, path: '/spaces' },
    { text: 'Levels', icon: <LevelIcon />, path: '/levels' },
  ];

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Tenants', icon: <AccountBalance />, path: '/tenants' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Assets', icon: <InventoryIcon />, path: '#', children: assetItems },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Reservations', icon: <ReservationIcon />, path: '/reservations' },
    { text: 'Deceased', icon: <DeceasedIcon />, path: '/deceased' },
    { text: 'Interments', icon: <IntermentIcon />, path: '/interments' },
    { text: 'Billing', icon: <BillingIcon />, path: '/billing' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Maintenance', icon: <MaintenanceIcon />, path: '/maintenance' },
  ];

  // Remove the conditional that adds Tenants and Users since they're now always in the list
  // Only hide them for non-admin users
  if (user?.role !== 'admin') {
    // Filter out Tenants and Users for non-admin users
    const adminOnlyPaths = ['/tenants', '/users'];
    menuItems.splice(1, 2); // Remove Tenants and Users (indexes 1 and 2)
  }

  const handleNavigation = (path: string) => {
    if (path !== '#') {
      navigate(path);
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return 'U';
  };

  const drawer = (
    <div>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          position: 'relative',
        }}
      >
        <IconButton 
          onClick={handleDrawerCollapse}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
            width: 28,
            height: 28,
          }}
        >
          {drawerCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
        
        <Box 
          sx={{ 
            my: 1,
            width: drawerCollapsed ? '60%' : '70%',
            maxWidth: drawerCollapsed ? '40px' : '160px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          <img 
            src="/images/logo.svg" 
            alt="Cemetery Management System" 
            style={{ 
              width: '100%',
              height: 'auto',
            }} 
          />
        </Box>
      </Box>
      
      {!drawerCollapsed && (
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Chip
                label={user?.role === 'admin' ? 'Administrator' : 'User'}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 'medium',
                  height: 20,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
      
      {drawerCollapsed && (
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={`${user?.firstName} ${user?.lastName}`} placement="right">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              {getUserInitials()}
            </Avatar>
          </Tooltip>
        </Box>
      )}
      
      <Divider />
      <List sx={{ px: 1, py: 0.5 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding sx={{ mb: 0.25 }}>
              <Tooltip title={drawerCollapsed ? item.text : ''} placement="right">
                <ListItemButton
                  onClick={() => item.children ? handleAssetsClick() : handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    py: 0.75,
                    justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    ...(window.location.pathname === item.path && {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                    }),
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: window.location.pathname === item.path ? theme.palette.primary.main : '#757575', 
                      minWidth: drawerCollapsed ? 0 : 36,
                      mr: drawerCollapsed ? 0 : 2,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!drawerCollapsed && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        fontWeight: window.location.pathname === item.path ? 600 : 400
                      }} 
                    />
                  )}
                  {!drawerCollapsed && item.children && (openAssets ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>
            </ListItem>
            
            {item.children && !drawerCollapsed && (
              <Collapse in={openAssets} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 2, py: 0 }}>
                  {item.children.map((child) => (
                    <ListItem key={child.text} disablePadding sx={{ mb: 0.25 }}>
                      <ListItemButton
                        onClick={() => handleNavigation(child.path)}
                        sx={{
                          borderRadius: 1,
                          pl: 2,
                          py: 0.75,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                          ...(window.location.pathname === child.path && {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            '& .MuiListItemIcon-root': {
                              color: theme.palette.primary.main,
                            },
                          }),
                        }}
                      >
                        <ListItemIcon sx={{ color: window.location.pathname === child.path ? theme.palette.primary.main : '#757575', minWidth: 36 }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.9rem',
                            fontWeight: window.location.pathname === child.path ? 600 : 400
                          }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ my: 0.5 }} />
      <List sx={{ px: 1, py: 0.5 }}>
        <ListItem disablePadding sx={{ mb: 0.25 }}>
          <Tooltip title={drawerCollapsed ? "Logout" : ''} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                py: 0.75,
                justifyContent: drawerCollapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: theme.palette.error.main, 
                  minWidth: drawerCollapsed ? 0 : 36,
                  mr: drawerCollapsed ? 0 : 2,
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!drawerCollapsed && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    color: theme.palette.error.main
                  }} 
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { sm: `${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          boxShadow: 'none',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          color: '#212121',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {menuItems.find(item => window.location.pathname === item.path)?.text || 
             assetItems.find(item => window.location.pathname === item.path)?.text || 
             'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mx: 1 }}>
              <SearchIcon />
            </IconButton>
            <IconButton sx={{ mx: 1 }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ mx: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerCollapsed ? collapsedDrawerWidth : drawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease-in-out',
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              transition: 'width 0.3s ease-in-out',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerCollapsed ? collapsedDrawerWidth : drawerWidth,
              transition: 'width 0.3s ease-in-out',
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)` }, 
          mt: '64px',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 