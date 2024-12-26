import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { jsPDF } from "jspdf";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedTransaction, setSearchedTransaction] = useState([]); // Array of transactions
  const [searchResultDialog, setSearchResultDialog] = useState(false); // Dialog visibility
  const [loading, setLoading] = useState(true);
  const [reminderMessage, setReminderMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get("/transactions/search", {
        params: { query: searchQuery },
      });
  
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Filter results based on student_usn or book_id as required
        const filteredTransactions = response.data.filter((transaction) => {
          // Check if the transaction matches the search query (for USN or book_id)
          return (
            transaction.student_usn === searchQuery ||
            transaction.book_id === parseInt(searchQuery) // assuming book_id is a number
          );
        });
        
        setSearchedTransaction(filteredTransactions); // Set filtered results
        setSearchResultDialog(true); // Open the dialog
      } else {
        setSearchedTransaction([]);
        alert("No transaction found.");
      }
    } catch (error) {
      console.error("Error searching transaction", error);
      alert("Error fetching search results.");
    }
  };
  

  const handleReturnBook = async (transaction) => {
    const today = new Date();
    const lateFee = calculateLateFee(transaction.due_date, today);

    try {
      await api.put(`/transactions/${transaction.id}`, {
        ...transaction,
        return_date: today.toISOString(),
        late_fee: lateFee,
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error returning book", error);
    }
  };

  const calculateLateFee = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    return daysLate > 0 ? daysLate * 5 : 0;
  };

  const generateReceipt = (transaction) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Transaction Receipt", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Student USN: ${transaction.student_usn}`, 20, 40);
    doc.text(`Book ID: ${transaction.book_id}`, 20, 50);
    doc.text(
      `Issue Date: ${new Date(transaction.issue_date).toLocaleDateString()}`,
      20,
      60
    );
    doc.text(
      `Due Date: ${new Date(transaction.due_date).toLocaleDateString()}`,
      20,
      70
    );
    doc.text(`Late Fee: ${transaction.late_fee || "0"}`, 20, 80);
    doc.text(
      `Return Date: ${new Date(transaction.return_date).toLocaleDateString()}`,
      20,
      90
    );

    doc.save(`receipt_${transaction.id}.pdf`);
  };

  const sendReminder = async (transaction) => {
    try {
      // Send GET request with query parameters for student_id or usn
      const response = await api.get("/send-reminders", {
        params: { usn: transaction.student_usn } // Send the USN as a query parameter
      });
  
      setReminderMessage(`Reminder sent to ${transaction.student?.name}`);
    } catch (error) {
      setReminderMessage(`Error sending reminder to ${transaction.student?.name}.`);
    }
  };
  

  if (loading) {
    return (
      <Container sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: "bold" }}>
          Loading Transactions...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        Transactions
      </Typography>

      {/* Search Bar */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <TextField
          label="Search by Student USN or Book ID"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ height: "fit-content" }}
        >
          Search
        </Button>
      </div>

      {/* Add Transaction Button */}
      <Button
        variant="contained"
        onClick={() => navigate("/add-transaction")}
        sx={{ marginBottom: 3 }}
      >
        Add Transaction
      </Button>

      {/* Reminder Message */}
      {reminderMessage && (
        <Typography variant="body1" sx={{ color: "green", marginBottom: 3 }}>
          {reminderMessage}
        </Typography>
      )}

      {/* Transactions Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Late Fee</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.student?.name || "N/A"}</TableCell>
                <TableCell>{transaction.book_id}</TableCell>
                <TableCell>{transaction.book?.title || "N/A"}</TableCell>
                <TableCell>
                  {new Date(transaction.issue_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(transaction.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.late_fee || "0"}</TableCell>
                <TableCell>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReturnBook(transaction)}
                    >
                      Return
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => generateReceipt(transaction)}
                    >
                      Generate Receipt
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => sendReminder(transaction)}
                    >
                      Send Reminder
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Search Result Dialog */}
      <Dialog open={searchResultDialog} onClose={() => setSearchResultDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Search Result</DialogTitle>
        <DialogContent>
          {searchedTransaction.length > 0 ? (
            <>
              {searchedTransaction.map((transaction) => (
                <Box key={transaction.id} sx={{ marginBottom: 3 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Transaction Details
                  </Typography>
                  <Typography>
                    <strong>Student USN:</strong> {transaction.student_usn}
                  </Typography>
                  <Typography>
                    <strong>Issue Date:</strong>{" "}
                    {new Date(transaction.issue_date).toLocaleDateString() || "Invalid Date"}
                  </Typography>
                  <Typography>
                    <strong>Due Date:</strong>{" "}
                    {new Date(transaction.due_date).toLocaleDateString() || "Invalid Date"}
                  </Typography>
                  <Typography>
                    <strong>Late Fee:</strong> {transaction.late_fee || 0}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Book Details
                  </Typography>
                  <Typography>
                    <strong>Title:</strong> {transaction.book?.title || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Author:</strong> {transaction.book?.author || "N/A"}
                  </Typography>
                </Box>
              ))}
            </>
          ) : (
            <Typography>No transaction found.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Transactions;
