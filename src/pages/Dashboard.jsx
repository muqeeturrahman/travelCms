import { Paper, Typography, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 font-medium text-gray-800">
        Dashboard
      </Typography>
      <Paper className="p-6 shadow-md">
        <Typography variant="h6" className="text-gray-700 mb-4">
          Welcome to Go Trip CMS
        </Typography>
        <Typography className="text-gray-600">
          This is your central dashboard for managing all aspects of the travel platform.
        </Typography>
      </Paper>
    </Box>
  );
} 