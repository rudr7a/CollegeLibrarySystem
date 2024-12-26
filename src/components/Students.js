import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Track search query

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateStudent = () => {
    navigate('/add-student'); // Navigate to the Add Student page
  };

  const handleViewProfile = (studentId) => {
    navigate(`/students/${studentId}`); // Navigate to student's profile page
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await api.delete(`/students/${studentId}`);
      fetchStudents(); // Refresh the list after deleting a student
    } catch (error) {
     
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Students List
      </Typography>
      <TextField
        label="Search Students"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleCreateStudent}
        sx={{ marginBottom: 2 }}
      >
        Add New Student
      </Button>

      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>USN</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.usn}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewProfile(student.id)}
                    sx={{ marginRight: 1 }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Students;
