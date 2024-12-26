import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AddTransaction = () => {
  const [usn, setUSN] = useState(""); // Changed from studentId to usn
  const [serialNumber, setSerialNumber] = useState(""); // Changed from bookId to serialNumber
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();

  const handleIssueDateChange = (e) => {
    const newIssueDate = e.target.value;
    setIssueDate(newIssueDate);
  
    // Auto-set due date to 15 days from issue date
    const due = new Date(newIssueDate);
    due.setDate(due.getDate() + 15); // Add 15 days to the issue date
    setDueDate(due.toISOString().split("T")[0]); // Format the date as YYYY-MM-DD
  };
  

  const handleAddTransaction = async () => {
    if (!usn || !serialNumber || !issueDate || !dueDate) {
      setError("All fields are required");
      return;
    }
  
    // Format the data to match exactly as in Postman
    const transactionData = {
      student_usn: usn.trim(), // Ensure no spaces in USN
      serial_number: serialNumber.trim(), // Ensure no spaces in Serial Number
      issue_date: issueDate, // Include the issue date
      due_date: dueDate,     // Include the due date
    };
  
    console.log("Sending Transaction Data:", transactionData); // Log the data
  
    try {
      await api.post("/transactions", transactionData); // Make the POST request with formatted data
      setDialogMessage("Transaction added successfully!");
      setOpenDialog(true);
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        "Error creating transaction. Please try again.";
      setDialogMessage(errMsg);
      setOpenDialog(true);
    }
  };
  

  const handleCancel = () => {
    setDialogMessage("Transaction creation cancelled.");
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/transactions");
  };

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        Add Transaction
      </Typography>
      <Paper sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Student USN"
          value={usn}
          onChange={(e) => setUSN(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Book Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Issue Date"
          type="date"
          value={issueDate}
          onChange={handleIssueDateChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled
        />
        <Button
          variant="contained"
          onClick={handleAddTransaction}
          sx={{ width: "100%", marginBottom: 1 }}
        >
          Add Transaction
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{ width: "100%" }}
        >
          Cancel
        </Button>
      </Paper>

      {/* Dialog Box for Success or Error Message */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Transaction Status</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddTransaction;
