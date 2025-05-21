import { Paper, Typography, Box } from '@mui/material';

export default function Customers() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-medium text-gray-800">
        Customer Management
      </Typography>

      <Paper className="p-6 shadow-md">
        <Typography variant="h6" className="text-gray-700 mb-4">
          Customer Overview
        </Typography>
        <Typography className="text-gray-600">
          View and manage customer profiles, bookings, and support requests.
        </Typography>
      </Paper>
    </Box>
  );
} 