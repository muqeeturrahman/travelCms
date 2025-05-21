import { Paper, Typography, Box } from '@mui/material';

export default function Settings() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-medium text-gray-800">
        System Settings
      </Typography>

      <Paper className="p-6 shadow-md">
        <Typography variant="h6" className="text-gray-700 mb-4">
          Platform Configuration
        </Typography>
        <Typography className="text-gray-600">
          Configure system settings, user permissions, and general preferences.
        </Typography>
      </Paper>
    </Box>
  );
} 