import { Paper, Typography, Box } from '@mui/material';

export default function Bookings() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-medium text-gray-800">
        Bookings Overview
      </Typography>

      <Paper className="p-6 shadow-md">
        <Typography variant="h6" className="text-gray-700 mb-4">
          All Bookings
        </Typography>
        <Typography className="text-gray-600">
          Track and manage all travel bookings across flights, hotels, and packages.
        </Typography>
      </Paper>
    </Box>
  );
} 