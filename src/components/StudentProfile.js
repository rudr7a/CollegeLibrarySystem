import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student details", error);
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        {student.name} - Profile
      </Typography>
      <Typography variant="body1">USN: {student.usn}</Typography>
      <Typography variant="body1">Email: {student.email}</Typography>
      <Typography variant="body1">Phone: {student.phone}</Typography>
      <Typography variant="body1">Department: {student.department}</Typography>
      {/* Display other details as necessary */}
      <Button onClick={() => navigate('/students')} variant="contained">Back to Students</Button>
    </Container>
  );
};

export default StudentProfile;
