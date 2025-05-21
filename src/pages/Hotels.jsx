import { Paper, Typography, Box } from '@mui/material';

export default function Hotels() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-medium text-gray-800">
        Hotels Management
      </Typography>

      <Paper className="p-6 shadow-md">
        <Typography variant="h6" className="text-gray-700 mb-4">
          Hotel Listings
        </Typography>
        <Typography className="text-gray-600">
          Manage your hotel inventory, bookings, and partnerships here.
        </Typography>
      </Paper>
    </Box>
  );
} 