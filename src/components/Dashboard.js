import React from 'react';
import { Container, Grid, Button, Typography, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        Library Management Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Manage Students Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Link to="/students" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#303f9f',
                  },
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
              >
                Manage Students
              </Button>
            </Link>
          </Paper>
        </Grid>

        {/* Manage Books Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Link to="/books" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#388e3c',
                  },
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
              >
                Manage Books
              </Button>
            </Link>
          </Paper>
        </Grid>

        {/* Manage Vendors Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Link to="/vendors" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#f57c00',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#ef6c00',
                  },
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
              >
                Manage Vendors
              </Button>
            </Link>
          </Paper>
        </Grid>

        {/* Manage Transactions Button */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Link to="/transactions" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#9c27b0',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#7b1fa2',
                  },
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: 3,
                }}
              >
                Manage Transactions
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
