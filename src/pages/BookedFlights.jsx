import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  FlightTakeoff,
  AccessTime,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3008/api';

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

export default function BookedFlights() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${API_BASE_URL}/user/getBookings`, {
          headers: {
            'Content-Type': 'application/json',
            'authToken': token
          }
        });

        if (response.data.success) {
          setBookings(response.data.data);
          
          // Calculate stats
          const newStats = response.data.data.reduce((acc, booking) => {
            acc.total++;
            switch(booking.paymentStatus.toLowerCase()) {
              case 'pending':
                acc.pending++;
                break;
              case 'confirmed':
                acc.confirmed++;
                break;
              case 'cancelled':
                acc.cancelled++;
                break;
              case 'waiting':
                acc.pending++;
                break;
            }
            return acc;
          }, { total: 0, pending: 0, confirmed: 0, cancelled: 0 });
          
          setStats(newStats);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
      case 'waiting':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      setModalLoading(true);
      setModalOpen(true);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/user/getBookingById/${bookingId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authToken': token
        }
      });

      if (response.data.success) {
        setSelectedBooking(response.data.data);
        console.log(response.data.data, 'booking data')
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBookings = bookings.filter((booking) =>
    Object.values(booking).some(
      (value) => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const statsCards = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: <FlightTakeoff className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending Bookings',
      value: stats.pending,
      icon: <AccessTime className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmed,
      icon: <CheckCircle className="text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Cancelled Bookings',
      value: stats.cancelled,
      icon: <Cancel className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/deleteBookingById/${bookingToDelete._id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'authToken': token
          }
        }
      );

      if (response.data.success) {
        // Remove the deleted booking from the list
        setBookings(bookings.filter(booking => booking._id !== bookingToDelete._id));
        
        // Update stats
        const newStats = { ...stats };
        newStats.total--;
        switch(bookingToDelete.paymentStatus.toLowerCase()) {
          case 'pending':
          case 'waiting':
            newStats.pending--;
            break;
          case 'confirmed':
            newStats.confirmed--;
            break;
          case 'cancelled':
            newStats.cancelled--;
            break;
        }
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking. Please try again.');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" className="font-medium text-gray-800">
          Booked Flights
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Paper
            key={stat.title}
            className={`p-4 ${stat.bgColor} border border-gray-100 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h3 className={`text-2xl font-semibold mt-2 ${stat.textColor}`}>
                  {stat.value}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm">
                {stat.icon}
              </div>
            </div>
          </Paper>
        ))}
      </div>

      <Paper className="shadow-md">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="text-gray-700 font-medium">
              Recent Bookings
            </Typography>
            <TextField
              size="small"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Flight</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking._id}</TableCell>
                      <TableCell>{booking.fullName}</TableCell>
                      <TableCell>{`${booking.from} → ${booking.to}`}</TableCell>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.paymentStatus}
                          color={getStatusColor(booking.paymentStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(booking._id)}
                            sx={{
                              color: '#3b82f6',
                              '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              },
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(booking)}
                            sx={{
                              color: '#ef4444',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t border-gray-100"
        />
      </Paper>

      {/* Details Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="booking-details-modal"
      >
        <Box sx={modalStyle}>
          {modalLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : selectedBooking ? (
            <>
              <Typography variant="h6" component="h2" mb={1} color="primary">
                Booking Details
              </Typography>
              
              <Box className="grid grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-1">
                  <Typography variant="subtitle1" color="primary" fontWeight="medium">
                    Customer Information
                  </Typography>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedBooking.fullName}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedBooking.email}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {selectedBooking.countryCode ? `+${selectedBooking.countryCode} ` : ''}{selectedBooking.phoneNumber}
                    </Typography>
                  </div>
                </div>

                {/* Flight Information */}
                <div className="space-y-4">
                  <Typography variant="subtitle1" color="primary" fontWeight="medium">
                    Flight Information
                  </Typography>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Route
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {selectedBooking.from} → {selectedBooking.to}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Travel Class
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {selectedBooking.travelClass}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {selectedBooking.duration}
                    </Typography>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <Typography variant="subtitle1" color="primary" fontWeight="medium">
                    Booking Details
                  </Typography>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {selectedBooking.orderId}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Booking Date
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      {formatDate(selectedBooking.createdAt)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedBooking.paymentStatus}
                      color={getStatusColor(selectedBooking.paymentStatus)}
                      size="small"
                    />
                  </div>
                </div>

                {/* Travel Details */}
                <div className="space-y-4">
                  <Typography variant="subtitle1" color="primary" fontWeight="medium">
                    Travel Details
                  </Typography>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Passengers
                    </Typography>
                    <Typography variant="body1" mb={1}>
                      Adults: {selectedBooking.adults}
                      {selectedBooking.children > 0 && `, Children: ${selectedBooking.children}`}
                      {selectedBooking.infants > 0 && `, Infants: ${selectedBooking.infants}`}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bags
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      Checked: {selectedBooking.checkedBags}, Cabin: {selectedBooking.cabinBags}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      ${selectedBooking.price.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </Box>
            </>
          ) : (
            <Typography color="error">Failed to load booking details</Typography>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 