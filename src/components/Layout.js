import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, Container, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'; 
import Students from './Students';
import Books from './Books';
import Vendors from './Vendors';
import Transactions from './Transactions';
import Home from './Home'; // Import the Home component

const Layout = ({ user, setUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();  
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    setUser(null);  // Clear user data
    navigate('/login'); // Redirect to login
  };

  if (!user) {
    return <Navigate to="/login" />;  // Redirect if not logged in
  }

  return (
    <div>
      {/* Horizontal AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          
          {/* Make the title clickable and redirect to home */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Library Management System
            </Link>
          </Typography>

          {/* Right-aligned username and logout button */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Vertical Sidebar (Drawer) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          zIndex: 1200, // Ensure the drawer is under the AppBar
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // Translucent blue background
            backdropFilter: 'blur(10px)', // Adding a blur effect
            position: 'relative',
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <List>
            <ListItem
              button
              component={Link}
              to="/students"
              sx={{
                border: '1px solid #009688', // Border for better visibility
                borderRadius: 1, // Rounded corners
                padding: '10px', // Padding for a more spacious look
                marginBottom: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slight background color
                color: '#ffffff', // Text color set to white
                transition: 'all 0.3s ease', // Smooth transition for hover effect
                '&:hover': {
                  backgroundColor: '#009688', // Change background on hover
                  color: '#fff', // Ensure text is white on hover
                  transform: 'scale(1.05)', // Slight scaling effect on hover
                },
              }}
            >
              <ListItemText primary="Students" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/books"
              sx={{
                border: '1px solid #ff4081',
                borderRadius: 1,
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#ffffff', // Text color set to white
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#ff4081',
                  color: '#fff',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ListItemText primary="Books" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/vendors"
              sx={{
                border: '1px solid #673ab7',
                borderRadius: 1,
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#ffffff', // Text color set to white
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#673ab7',
                  color: '#fff',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ListItemText primary="Vendors" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/transactions"
              sx={{
                border: '1px solid #4caf50',
                borderRadius: 1,
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#ffffff', // Text color set to white
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ListItemText primary="Transactions" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/students" element={<Students />} />
          <Route path="/books" element={<Books />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Container>
    </div>
  );
};

export default Layout;
