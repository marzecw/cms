import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tenants from './pages/Tenants';
import Cemeteries from './pages/Cemeteries';
import Gardens from './pages/Gardens';
import Lots from './pages/Lots';
import LotView from './pages/LotView';
import Spaces from './pages/Spaces';
import SpaceLevelManagement from './pages/SpaceLevels';
import Customers from './pages/Customers';
import Reservations from './pages/Reservations';
import Deceased from './pages/Deceased';
import Interments from './pages/Interments';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      light: '#4caf50',
      main: '#2e7d32',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    secondary: {
      light: '#7986cb',
      main: '#5c6bc0',
      dark: '#3f51b5',
      contrastText: '#fff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#757575',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#2e7d32',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/cemeteries" element={<Cemeteries />} />
                <Route path="/gardens" element={<Gardens />} />
                <Route path="/lots" element={<Lots />} />
                <Route path="/lots/:id" element={<LotView />} />
                <Route path="/spaces" element={<Spaces />} />
                <Route path="/space-levels" element={<SpaceLevelManagement />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/deceased" element={<Deceased />} />
                <Route path="/interments" element={<Interments />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/maintenance" element={<Maintenance />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 