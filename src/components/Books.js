import React, { useState, useEffect } from 'react';
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from '../api/api';  // Make sure you have a utility to call your API
import { useNavigate } from 'react-router-dom';  // React Router for navigation

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookDetails, setBookDetails] = useState(null); // State for storing book details in dialog
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to manage delete confirmation dialog
  const [bookToDelete, setBookToDelete] = useState(null); // Store the book to delete

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateBook = () => {
    navigate('/add-book');  // Redirect to the add book page
  };

  const handleViewBookDetails = async (book) => {
    try {
      const response = await api.get(`/books/${book.ID}`);  // Fetch book details by ID from the API
      setBookDetails(response.data);  // Set the fetched data to state
      setOpenDialog(true);  // Open the dialog to show the details
    } catch (error) {
      console.error("Error fetching book details:", error);
      alert('Failed to fetch book details');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBookDetails(null);
  };

  // Download the book using the API endpoint
  const handleDownloadBook = async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.pdf`); // You can change the filename or get it from the response
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to download the book');
    }
  };

  const handleDeleteBook = async () => {
    try {
      if (bookToDelete) {
        await api.delete(`/books/${bookToDelete.id}`);
        setBooks(books.filter((book) => book.id !== bookToDelete.id)); // Remove deleted book from the state
        setOpenDeleteDialog(false);
        setBookToDelete(null); // Reset the book to delete
      }
    } catch (error) {
      alert('Failed to delete the book');
    }
  };

  const filteredBooks = books.filter((book) =>
    (book.title && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  

  // Reverse the books array when rendering
  const reversedBooks = filteredBooks.reverse();

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        Books List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Books"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        sx={{ marginBottom: 3 }}
      />

      {/* Button to navigate to Add Book Page */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateBook}
        sx={{ marginBottom: 3 }}
      >
        Add New Book
      </Button>

      {/* Table to Display Books */}
      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Rack Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {books.map((book) => (  // Render all books for now
    <TableRow key={book.ID}>
      <TableCell>{book.Title}</TableCell>
      <TableCell>{book.Author}</TableCell>
      <TableCell>{book.Publisher}</TableCell>
      <TableCell>{book.RackNumber}</TableCell>
      <TableCell>
        <Button onClick={() => handleViewBookDetails(book)}>View Details</Button>
        <Button onClick={() => handleDownloadBook(book.ID)}>Download Book</Button>
        <Button 
          color="error" 
          onClick={() => {
            setBookToDelete(book); 
            setOpenDeleteDialog(true); 
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>


        </Table>
      </TableContainer>

      {/* Dialog to show Book Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
  <DialogTitle>Book Details</DialogTitle>
  <DialogContent>
    {bookDetails && (
      <>
        <Typography variant="h6">{bookDetails.Title}</Typography> {/* Adjusted to Title */}
        <Typography variant="body1"><strong>Author:</strong> {bookDetails.Author}</Typography> {/* Adjusted to Author */}
        <Typography variant="body1"><strong>Publisher:</strong> {bookDetails.Publisher}</Typography> {/* Adjusted to Publisher */}
        <Typography variant="body1"><strong>Note:</strong> {bookDetails.Note}</Typography> {/* Adjusted to Note */}
        <Typography variant="body1"><strong>Rack Number:</strong> {bookDetails.RackNumber}</Typography> {/* Adjusted to RackNumber */}
        <Typography variant="body1"><strong>Serial Number:</strong> {bookDetails.SerialNumber}</Typography> {/* Adjusted to SerialNumber */}
        <Typography variant="body1"><strong>Vendor ID:</strong> {bookDetails.VendorID}</Typography> {/* Adjusted to VendorID */}
        <Typography variant="body1"><strong>Price:</strong> {bookDetails.Price}</Typography> {/* Adjusted to Price */}
        <Typography variant="body1"><strong>Received Date:</strong> {bookDetails.ReceivedDate}</Typography> {/* Adjusted to ReceivedDate */}
        <Typography variant="body1"><strong>Invoice Number:</strong> {bookDetails.InvoiceNumber}</Typography> {/* Adjusted to InvoiceNumber */}
        <Typography variant="body1"><strong>Discount:</strong> {bookDetails.Discount}</Typography> {/* Adjusted to Discount */}
        
        {/* If EbookPDF exists, show the link for download */}
        {bookDetails.EBookPDF && (
          <Typography variant="body1">
            <strong>Download EBook:</strong>
            <Button onClick={() => handleDownloadBook(bookDetails.ID)}>Download</Button>
          </Typography>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="secondary">
      Close
    </Button>
  </DialogActions>
</Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBook} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Books;
