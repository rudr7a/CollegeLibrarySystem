import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Divider,
} from "@mui/material";

const Home = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBooks, setNewBooks] = useState([]); // Track recently added books
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch books data from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8008/books");
        setBooks(response.data);

        // Filter books added in the last 7 days
        const recentBooks = response.data.filter((book) => {
          const addedDate = new Date(book.addedDate);
          const currentDate = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(currentDate.getDate() - 7);
          return addedDate >= sevenDaysAgo;
        });
        setNewBooks(recentBooks);
      } catch (error) {
       
      }
    };

    fetchBooks();
  }, []);

  // Fetch book based on search term from API
  const handleSearch = async (title = searchTerm) => {
    if (title.trim() === "") {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8008/books/search?title=${title}`
      );
      const book = response.data.length > 0 ? response.data[0] : null; // Get first book from search results
      if (book) {
        setSelectedBook(book); // Set selected book for the dialog
        setOpenDialog(true); // Open dialog to show book details
      } else {
        setSelectedBook(null); // Clear selected book if not found
        setOpenDialog(false); // Close dialog if no book is found
      }
    } catch (error) {
      
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setSelectedBook(null); // Clear selected book when closing the dialog
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: 4, fontWeight: "bold", color: "#3f51b5" }}
      >
        Welcome, {user.username}!
      </Typography>

      {/* Search Box */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <TextField
          label="Search Books"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600, marginRight: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ padding: "10px 20px", alignSelf: "center" }}
        >
          Search
        </Button>
      </Box>

      {/* Recently Added Books Section */}
      <Typography
        variant="h5"
        align="center"
        sx={{ marginTop: 6, fontWeight: "bold" }}
      >
        Recently Added Books
      </Typography>
      <Divider sx={{ marginBottom: 4 }} />

      <Grid container spacing={3} justifyContent="center">
        {newBooks.length > 0 ? (
          newBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card elevation={6} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#3f51b5" }}
                  >
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Author: {book.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Publisher: {book.publisher}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Added on: {new Date(book.addedDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSearch(book.title)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No new books added recently.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Book Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ textAlign: "center", color: "#3f51b5" }}>
          Book Details
        </DialogTitle>
        <DialogContent>
          {selectedBook ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {selectedBook.title}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                Author: {selectedBook.author}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                Publisher: {selectedBook.publisher}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                Added Date:{" "}
                {new Date(selectedBook.addedDate).toLocaleDateString()}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1">
              No book found with that title.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
            sx={{ alignSelf: "center" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
