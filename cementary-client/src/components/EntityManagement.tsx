import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Chip,
  InputBase,
  Card,
  CardContent,
  Alert,
  TableSortLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: any) => string | React.ReactNode;
  sortable?: boolean;
}

interface EntityManagementProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  error?: string | null;
}

// Type for sort direction
type Order = 'asc' | 'desc';

const EntityManagement: React.FC<EntityManagementProps> = ({
  title,
  subtitle,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  error,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<Order>('asc');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter data based on search term
  const filteredData = data.filter(row => {
    return Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data based on orderBy and order
  const sortedData = React.useMemo(() => {
    if (!orderBy) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      // Handle nested objects (like cemetery.cemetery_name)
      const getNestedValue = (obj: any, path: string) => {
        const keys = path.split('.');
        return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
      };

      let aCompare = typeof aValue === 'object' && aValue !== null ? getNestedValue(a, orderBy) : aValue;
      let bCompare = typeof bValue === 'object' && bValue !== null ? getNestedValue(b, orderBy) : bValue;

      // Convert to strings for comparison if they're not numbers
      if (typeof aCompare !== 'number' && typeof bCompare !== 'number') {
        aCompare = aCompare ? aCompare.toString().toLowerCase() : '';
        bCompare = bCompare ? bCompare.toString().toLowerCase() : '';
      }

      if (bCompare < aCompare) {
        return order === 'asc' ? 1 : -1;
      }
      if (bCompare > aCompare) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ 
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                px: 3,
              }}
            >
              Add New
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              sx={{ 
                color: '#757575',
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#757575',
                  bgcolor: 'transparent',
                },
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              sx={{ 
                color: '#757575',
                borderColor: '#e0e0e0',
                '&:hover': {
                  borderColor: '#757575',
                  bgcolor: 'transparent',
                },
              }}
            >
              Export
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', px: 2, py: 0.5, borderRadius: 1 }}>
            <SearchIcon sx={{ color: '#757575', mr: 1 }} />
            <InputBase
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ color: '#212121' }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card 
        elevation={0} 
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ 
                      minWidth: column.minWidth,
                      backgroundColor: '#f8f9fa',
                      fontWeight: 600,
                      color: '#212121',
                      borderBottom: '2px solid #e0e0e0',
                    }}
                  >
                    {column.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                <TableCell 
                  align="center" 
                  style={{ 
                    minWidth: 120,
                    backgroundColor: '#f8f9fa',
                    fontWeight: 600,
                    color: '#212121',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row.id}
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        {onView && (
                          <Tooltip title="View">
                            <IconButton 
                              size="small" 
                              onClick={() => onView(row.id)}
                              sx={{ 
                                color: theme.palette.info.main,
                                '&:hover': { backgroundColor: alpha(theme.palette.info.main, 0.1) },
                                mx: 0.5,
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => onEdit(row.id)}
                              sx={{ 
                                color: theme.palette.warning.main,
                                '&:hover': { backgroundColor: alpha(theme.palette.warning.main, 0.1) },
                                mx: 0.5,
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              onClick={() => onDelete(row.id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
                                mx: 0.5,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid #e0e0e0',
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: '#757575',
            },
          }}
        />
      </Card>
    </Box>
  );
};

export default EntityManagement; 