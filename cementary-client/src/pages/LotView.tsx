import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  useTheme,
  alpha,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  GridOn as GridOnIcon,
  Map as MapIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lot-tabpanel-${index}`}
      aria-labelledby={`lot-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Space {
  id: number;
  spaceNumber: string;
  type: string;
  status: string;
  price: number;
  occupantName?: string;
  intermentDate?: string;
}

interface Lot {
  id: number;
  lotNumber: string;
  gardenId: number;
  gardenName: string;
  cemeteryName: string;
  size: string;
  totalSpaces: number;
  availableSpaces: number;
  price: number;
  status: string;
  spaces: Space[];
}

const LotView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchLotData = async () => {
      try {
        // In a real application, you would fetch data from an API
        // For now, we'll use mock data
        setTimeout(() => {
          const mockLot: Lot = {
            id: parseInt(id || '1'),
            lotNumber: 'A-101',
            gardenId: 1,
            gardenName: 'Rose Garden',
            cemeteryName: 'Evergreen Memorial',
            size: '100 sq ft',
            totalSpaces: 9,
            availableSpaces: 4,
            price: 3500,
            status: 'available',
            spaces: [
              { id: 1, spaceNumber: 'A-101-1', type: 'standard', status: 'available', price: 1200 },
              { id: 2, spaceNumber: 'A-101-2', type: 'standard', status: 'occupied', price: 1200, occupantName: 'John Smith', intermentDate: '2023-05-15' },
              { id: 3, spaceNumber: 'A-101-3', type: 'standard', status: 'reserved', price: 1200 },
              { id: 4, spaceNumber: 'A-101-4', type: 'premium', status: 'occupied', price: 1800, occupantName: 'Mary Johnson', intermentDate: '2023-06-22' },
              { id: 5, spaceNumber: 'A-101-5', type: 'premium', status: 'available', price: 1800 },
              { id: 6, spaceNumber: 'A-101-6', type: 'standard', status: 'available', price: 1200 },
              { id: 7, spaceNumber: 'A-101-7', type: 'standard', status: 'available', price: 1200 },
              { id: 8, spaceNumber: 'A-101-8', type: 'premium', status: 'reserved', price: 1800 },
              { id: 9, spaceNumber: 'A-101-9', type: 'premium', status: 'maintenance', price: 1800 },
            ],
          };
          setLot(mockLot);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching lot data:', error);
        setLoading(false);
      }
    };

    fetchLotData();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return theme.palette.success.main;
      case 'occupied':
        return theme.palette.error.main;
      case 'reserved':
        return theme.palette.warning.main;
      case 'maintenance':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon fontSize="small" />;
      case 'occupied':
        return <PersonIcon fontSize="small" />;
      case 'reserved':
        return <AccessTimeIcon fontSize="small" />;
      case 'maintenance':
        return <CancelIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  // Function to generate a realistic layout for the advanced map
  const generateSpaceLayout = () => {
    if (!lot?.spaces) return [];
    
    // Create a grid layout based on the number of spaces
    const totalSpaces = lot.spaces.length;
    const columns = Math.ceil(Math.sqrt(totalSpaces));
    const rows = Math.ceil(totalSpaces / columns);
    
    // Create a 2D array to represent the layout
    const layout: (Space | null)[][] = Array(rows).fill(null).map(() => Array(columns).fill(null));
    
    // Fill the layout with spaces
    lot.spaces.forEach((space, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      layout[row][col] = space;
    });
    
    return layout;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Loading lot details...</Typography>
      </Box>
    );
  }

  if (!lot) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Lot not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link 
              color="inherit" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/lots');
              }}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <GridOnIcon sx={{ mr: 0.5 }} fontSize="small" />
              Lots
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {lot.lotNumber}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="bold">
            Lot {lot.lotNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lot.gardenName}, {lot.cemeteryName}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/lots')}
            sx={{ mr: 2 }}
          >
            Back to Lots
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => console.log('Edit lot')}
          >
            Edit Lot
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="lot tabs">
          <Tab label="Overview" />
          <Tab label="Space Map" />
          <Tab label="Space Map Advanced" />
          <Tab label="Spaces List" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Lot Details
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Lot Number</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.lotNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Garden</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.gardenName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Cemetery</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.cemeteryName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Size</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.size}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Total Spaces</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.totalSpaces}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Available Spaces</Typography>
                    <Typography variant="body1" fontWeight="medium">{lot.availableSpaces}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Price</Typography>
                    <Typography variant="body1" fontWeight="medium">${lot.price.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={lot.status.charAt(0).toUpperCase() + lot.status.slice(1)} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getStatusColor(lot.status), 0.1),
                        color: getStatusColor(lot.status),
                        fontWeight: 'medium',
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Space Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, width: 24, height: 24, mr: 1 }}>
                        <CheckCircleIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">Available</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="medium" color={theme.palette.success.main}>
                      {lot.spaces.filter(space => space.status === 'available').length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main, width: 24, height: 24, mr: 1 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">Occupied</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="medium" color={theme.palette.error.main}>
                      {lot.spaces.filter(space => space.status === 'occupied').length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 24, height: 24, mr: 1 }}>
                        <AccessTimeIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">Reserved</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="medium" color={theme.palette.warning.main}>
                      {lot.spaces.filter(space => space.status === 'reserved').length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, width: 24, height: 24, mr: 1 }}>
                        <CancelIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2">Maintenance</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="medium" color={theme.palette.info.main}>
                      {lot.spaces.filter(space => space.status === 'maintenance').length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Space Map Tab */}
      <TabPanel value={value} index={1}>
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Space Map
              </Typography>
              <Box>
                <Tooltip title="Available">
                  <Chip 
                    icon={<CheckCircleIcon fontSize="small" />}
                    label="Available" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 'medium',
                      mr: 1,
                    }}
                  />
                </Tooltip>
                <Tooltip title="Occupied">
                  <Chip 
                    icon={<PersonIcon fontSize="small" />}
                    label="Occupied" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      fontWeight: 'medium',
                      mr: 1,
                    }}
                  />
                </Tooltip>
                <Tooltip title="Reserved">
                  <Chip 
                    icon={<AccessTimeIcon fontSize="small" />}
                    label="Reserved" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      fontWeight: 'medium',
                      mr: 1,
                    }}
                  />
                </Tooltip>
                <Tooltip title="Maintenance">
                  <Chip 
                    icon={<CancelIcon fontSize="small" />}
                    label="Maintenance" 
                    size="small"
                    sx={{ 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      fontWeight: 'medium',
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                {lot.spaces.map((space) => (
                  <Grid item xs={4} key={space.id}>
                    <Card 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        bgcolor: alpha(getStatusColor(space.status), 0.05),
                        borderColor: alpha(getStatusColor(space.status), 0.3),
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => console.log(`View space ${space.id}`)}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: alpha(getStatusColor(space.status), 0.1),
                          color: getStatusColor(space.status),
                          margin: '0 auto 8px',
                        }}
                      >
                        {getStatusIcon(space.status)}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {space.spaceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {space.type.charAt(0).toUpperCase() + space.type.slice(1)}
                      </Typography>
                      {space.occupantName && (
                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                          {space.occupantName}
                        </Typography>
                      )}
                      <Typography variant="caption" fontWeight="medium" color={getStatusColor(space.status)}>
                        {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Space Map Advanced Tab */}
      <TabPanel value={value} index={2}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Advanced Space Map - Lot {lot?.lotNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This map represents the physical layout of spaces in the lot. Click on a space for more details.
            </Typography>
            
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              backgroundColor: '#f5f5f5',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <Box sx={{ 
                position: 'absolute', 
                top: 10, 
                left: 10, 
                fontSize: '0.75rem', 
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box component="span" sx={{ fontSize: '1.2rem' }}>↑</Box> North
              </Box>
              
              <Box sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: 10, 
                fontSize: '0.75rem', 
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                Garden: {lot?.gardenName}
              </Box>
              
              {/* Pathways */}
              <Box sx={{ 
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '20px',
                backgroundColor: '#d9d9d9',
                transform: 'translateY(-50%)',
                zIndex: 0
              }} />
              
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '20px',
                backgroundColor: '#d9d9d9',
                transform: 'translateX(-50%)',
                zIndex: 0
              }} />
              
              {/* Spaces grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 2,
                position: 'relative',
                zIndex: 1,
                p: 3
              }}>
                {generateSpaceLayout().map((row, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((space, colIndex) => (
                      space ? (
                        <Box 
                          key={`space-${space.id}`}
                          sx={{
                            backgroundColor: getStatusColor(space.status),
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: 1,
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 100,
                            position: 'relative',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              zIndex: 2
                            }
                          }}
                        >
                          <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                            {getStatusIcon(space.status)}
                          </Box>
                          <Typography variant="subtitle2" fontWeight="bold" align="center">
                            {space.spaceNumber}
                          </Typography>
                          <Typography variant="caption" align="center" sx={{ mt: 0.5 }}>
                            {space.type}
                          </Typography>
                          {space.occupantName && (
                            <Typography variant="caption" align="center" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              {space.occupantName}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Box 
                          key={`empty-${rowIndex}-${colIndex}`}
                          sx={{
                            backgroundColor: 'transparent',
                            minHeight: 100
                          }}
                        />
                      )
                    ))}
                  </React.Fragment>
                ))}
              </Box>
              
              {/* Legend */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 3, 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#e8f5e9', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 0.5 }} />
                  <Typography variant="caption">Available</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#ffebee', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 0.5 }} />
                  <Typography variant="caption">Occupied</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#fff8e1', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 0.5 }} />
                  <Typography variant="caption">Reserved</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#e0e0e0', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 0.5 }} />
                  <Typography variant="caption">Maintenance</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Spaces List Tab */}
      <TabPanel value={value} index={3}>
        <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
              Spaces List
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              {lot.spaces.map((space) => (
                <Grid item xs={12} sm={6} md={4} key={space.id}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      }
                    }}
                    onClick={() => console.log(`View space ${space.id}`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {space.spaceNumber}
                      </Typography>
                      <Chip 
                        label={space.status.charAt(0).toUpperCase() + space.status.slice(1)} 
                        size="small"
                        icon={getStatusIcon(space.status)}
                        sx={{ 
                          bgcolor: alpha(getStatusColor(space.status), 0.1),
                          color: getStatusColor(space.status),
                          fontWeight: 'medium',
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Type</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {space.type.charAt(0).toUpperCase() + space.type.slice(1)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ${space.price.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    {space.occupantName && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Occupant</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {space.occupantName}
                        </Typography>
                      </Box>
                    )}
                    
                    {space.intermentDate && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Interment Date</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {space.intermentDate}
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default LotView; 