import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Box, Typography, Paper, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import api from '../api/api';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data); 
    } catch (error) {
     
    }
  };

  const handleViewVendorProfile = async (vendorId) => {
    try {
      const response = await api.get(`/vendors/${vendorId}`);
      setSelectedVendor(response.data); 
      setOpenProfileModal(true);
    } catch (error) {
     
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVendors = vendors.filter((vendor) =>
    (vendor.vendor_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Vendors
      </Typography>
      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={() => navigate('/add-vendor')}
      >
        Add Vendor
      </Button>

      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        sx={{ marginY: 3 }}
        placeholder="Search by Vendor Name"
      />

      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>{vendor.vendor_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleViewVendorProfile(vendor.id)}
                      sx={{ marginLeft: 1 }}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No vendors found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Paper sx={{ padding: 3, width: '80%' }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Vendor Profile
          </Typography>

          {selectedVendor && (
            <Box sx={{ marginBottom: 3 }}>
              <Typography><strong>Vendor ID:</strong> {selectedVendor.id}</Typography>
              <Typography><strong>Name:</strong> {selectedVendor.vendor_name}</Typography>
              <Typography><strong>Contact:</strong> {selectedVendor.contact}</Typography>
              <Typography><strong>Email:</strong> {selectedVendor.email}</Typography>
              <Typography><strong>Address:</strong> {selectedVendor.address}</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={() => setOpenProfileModal(false)}
            sx={{ marginTop: 3 }}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Vendors;
