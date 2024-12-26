import React, { useState } from 'react';
import { Container, TextField, Button, Typography, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AddVendor = () => {
  const [vendorName, setVendorName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!vendorName) newErrors.vendorName = 'Vendor Name is required';
    if (!contact || !/^\d{10}$/.test(contact)) newErrors.contact = 'Enter a valid 10-digit phone number';
    if (!email) newErrors.email = 'Email is required';
    if (!address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleAddVendor = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const vendorData = {
      vendor_name: vendorName,
      contact: contact,
      email: email,
      address: address,
    };

    try {
      await api.post('/vendors', vendorData);
      setDialogMessage('Vendor added successfully!');
      setIsSuccess(true);
    } catch (error) {
      setDialogMessage('Error adding vendor. Please try again.');
      setIsSuccess(false);
    } finally {
      setOpenDialog(true);
    }
  };

  const handleCancel = () => {
    navigate('/vendors');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (isSuccess) {
      navigate('/vendors');
    }
  };

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Add Vendor
      </Typography>
      <TextField
        label="Vendor Name"
        value={vendorName}
        onChange={(e) => setVendorName(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        required
        error={Boolean(errors.vendorName)}
        helperText={errors.vendorName}
      />
      <TextField
        label="Phone"
        value={contact}
        onChange={(e) => {
          const newPhone = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
          if (newPhone.length <= 10) {
            setContact(newPhone); // Set the value only if the phone length is <= 10
          }
        }}
        fullWidth
        sx={{ marginBottom: 2 }}
        required
        error={Boolean(errors.contact)}
        helperText={errors.contact || (contact.length === 10 ? "" : "Phone number must be 10 digits")}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        required
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        error={Boolean(errors.address)}
        helperText={errors.address}
      />
      <Button
        variant="contained"
        onClick={handleAddVendor}
        sx={{ width: '100%', marginBottom: 2 }}
      >
        Add Vendor
      </Button>
      <Button
        variant="outlined"
        onClick={handleCancel}
        sx={{ width: '100%' }}
      >
        Cancel
      </Button>

      {/* Dialog for success/failure message */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isSuccess ? 'Success' : 'Error'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {isSuccess ? 'Go to Vendors' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddVendor;
