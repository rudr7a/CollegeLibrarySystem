import React, { useState } from 'react';
import { Container, TextField, Button, Typography, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useNavigate } from 'react-router-dom'; // Import navigation
import api from '../api/api';

const AddStudent = () => {
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [admissionYear, setAdmissionYear] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [remark, setRemark] = useState('');
  const [department, setDepartment] = useState('');

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState(''); // 'success' or 'error'

  const navigate = useNavigate(); // Initialize navigation

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!usn) newErrors.usn = 'USN is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone || !/^\d{10}$/.test(phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!address) newErrors.address = 'Address is required';
    if (!admissionYear) newErrors.admissionYear = 'Admission Year is required';
    if (!department) newErrors.department = 'Department is required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry Date is required';
    if (!remark) newErrors.remark = 'Remark is required';
    return newErrors;
  };

  const handleAddStudent = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const studentData = {
      name,
      usn,
      email,
      phone,
      address,
      admissionYear: admissionYear, // Only year
      department,
      expiryDate: expiryDate, // Convert date to string
      remark,
    };

    try {
      await api.post('/students', studentData);
      setDialogMessage('Student added successfully');
      setDialogType('success');
      setOpenDialog(true);
    } catch (error) {
      setDialogMessage('Error adding student');
      setDialogType('error');
      setOpenDialog(true);
    }
  };

  const handleGoBack = () => {
    navigate('/students'); // Navigate back to the students page
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
          Add New Student
        </Typography>

        {/* Name Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </FormControl>

        {/* USN Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="USN"
            required
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            error={Boolean(errors.usn)}
            helperText={errors.usn}
          />
        </FormControl>

        {/* Email Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </FormControl>

        {/* Phone Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
  <TextField
    label="Phone"
    required
    value={phone}
    onChange={(e) => {
      const newPhone = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
      if (newPhone.length <= 10) {
        setPhone(newPhone); // Set the value only if the phone length is <= 10
      }
    }}
    error={Boolean(errors.phone)}
    helperText={errors.phone || (phone.length === 10 ? "" : "Phone number must be 10 digits")}
  />
</FormControl>


        {/* Address Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address}
          />
        </FormControl>

       
<FormControl fullWidth sx={{ marginBottom: 2 }}>
  <DatePicker
    views={['year']} // Restrict to year selection only
    label="Admission Year"
    required
    value={admissionYear ? new Date(admissionYear, 0, 1) : null} // Convert to full Date object
    onChange={(date) => setAdmissionYear(date ? date.getFullYear() : null)} // Store only the year
    renderInput={(params) => <TextField {...params} />}
  />
  {errors.admissionYear && <FormHelperText error>{errors.admissionYear}</FormHelperText>}
</FormControl>


        {/* Department Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="Department"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            error={Boolean(errors.department)}
            helperText={errors.department}
          />
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
  <DatePicker
    views={['year']} // Restrict to year selection only
    label="Ending Year"
    required
    value={expiryDate ? new Date(expiryDate, 0, 1) : null} // Convert to full Date object
    onChange={(date) => setExpiryDate(date ? date.getFullYear() : null)} // Store only the year
    renderInput={(params) => <TextField {...params} />}
  />
  {errors.expiryDate && <FormHelperText error>{errors.expiryDate}</FormHelperText>}
</FormControl>


        {/* Remark Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <TextField
            label="Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            error={Boolean(errors.remark)}
            helperText={errors.remark}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleAddStudent}
          sx={{ width: '100%', marginBottom: 2 }}
        >
          Add Student
        </Button>

        {/* Go Back Button */}
        <Button
          variant="outlined"
          onClick={handleGoBack}
          sx={{ width: '100%', marginBottom: 2 }}
        >
          Go Back
        </Button>

        {/* Dialog for Success/Error */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{dialogType === 'success' ? 'Success' : 'Error'}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default AddStudent;
