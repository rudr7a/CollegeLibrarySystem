import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Grid, Box } from "@mui/material";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Both fields are required");
      return;
    }

    const data = { username, password };

    try {
      const response = await axios.post("http://localhost:8008/register", data);

      if (response.status === 200) {
        setUser({ username });
      } else {
        setErrorMessage("Registration failed");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleRegister}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginTop: 2 }}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
        {errorMessage && <Typography color="error" sx={{ marginTop: 2 }}>{errorMessage}</Typography>}
      </Box>
    </Container>
  );
};

export default Register;
