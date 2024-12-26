import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    edition: "",
    publisher: "",
    publisherYear: null,
    serialNumbers: [""],
    rackNumbers: [""],
    copies: 1,
    vendorId: "",
    note: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "copies" && value >= 1) {
      const newCopies = parseInt(value, 10);
      const newSerialNumbers = Array(newCopies).fill("");
      const newRackNumbers = Array(newCopies).fill("");
      setFormData({ ...formData, copies: newCopies, serialNumbers: newSerialNumbers, rackNumbers: newRackNumbers });
    } else if (name === "copies" && value <= 0) {
      alert("Number of copies should be a positive integer.");
      setFormData({ ...formData, copies: 1, serialNumbers: [""], rackNumbers: [""] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, publisherYear: newDate });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure serialNumbers and rackNumbers are not empty
    if (formData.serialNumbers.some((num) => num === "") || formData.rackNumbers.some((num) => num === "")) {
      alert("Please fill in all serial numbers and rack numbers.");
      return;
    }
  
    // Ensure vendorId is a number if needed
    const vendorId = parseInt(formData.vendorId, 10); // Convert to number
    if (isNaN(vendorId)) {
      alert("Please enter a valid Vendor ID.");
      return;
    }
  
    // Extract the year from the publisherYear Date object
    const publisherYear = formData.publisherYear instanceof Date ? formData.publisherYear.getFullYear() : null;
  
    // Validate publisherYear
    if (!publisherYear || isNaN(publisherYear)) {
      alert("Please provide a valid publisher year.");
      return;
    }
  
    // Prepare the payload for submission
    const requestPayload = {
      title: formData.title,
      subtitle: formData.subtitle,
      author: formData.author,
      edition: parseInt(formData.edition, 10) || null, // Ensure edition is a number
      publisher: formData.publisher,
      publisher_year: publisherYear, // Send as an integer
      vendor_id: vendorId, // Send as number
      copies: formData.copies,
      serial_numbers: formData.serialNumbers,
      rack_numbers: formData.rackNumbers,
      note: formData.note,
    };
  
    try {
      // Send the request to add the book
      const bookResponse = await axios.post("http://localhost:8008/books", requestPayload);
      const bookId = bookResponse.data.id;
  
      if (pdfFile) {
        const fileData = new FormData();
        fileData.append("ebook_pdf", pdfFile);
  
        // Upload the PDF if available
        await axios.post(`http://localhost:8008/books/${bookId}/upload`, fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setUploadSuccess(true);
      } else {
        alert("Book added successfully!");
        navigate("/books");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };
  
  

  const handleCancel = () => {
    navigate("/books");
  };

  const handleDialogClose = () => {
    setUploadSuccess(false);
    navigate("/");
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Add New Book
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
  <TextField
    label="Edition"
    name="edition"
    value={formData.edition || ""} // Empty if no value is provided
    onChange={(e) => {
      const value = e.target.value;

      // Validate the input as a positive integer or empty
      if (/^\d*$/.test(value)) {
        setFormData({
          ...formData,
          edition: value === "" ? "" : parseInt(value, 10),
        });
      }
    }}
    fullWidth
    required
    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Ensure only numeric input
  />
</Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year"]}
                label="Publisher Year"
                value={formData.publisherYear}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
  <TextField
    label="Copies"
    name="copies"
    value={formData.copies || ""} // Empty if no value is provided
    onChange={(e) => {
      const value = e.target.value;

      // Validate the input as a positive integer or empty
      if (/^\d*$/.test(value)) {
        const newCopies = value === "" ? 0 : parseInt(value, 10);
        const newSerialNumbers = Array(newCopies).fill("");
        const newRackNumbers = Array(newCopies).fill("");
        setFormData({
          ...formData,
          copies: value === "" ? "" : newCopies,
          serialNumbers: newSerialNumbers,
          rackNumbers: newRackNumbers,
        });
      }
    }}
    fullWidth
    required
    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Ensure only numeric input
  />
</Grid>


          {formData.serialNumbers.map((serial, index) => (
            <Grid item xs={12} sm={6} key={`serial-${index}`}>
              <TextField
                label={`Serial Number ${index + 1}`}
                name={`serialNumber${index}`}
                value={serial}
                onChange={(e) => {
                  const updatedSerialNumbers = [...formData.serialNumbers];
                  updatedSerialNumbers[index] = e.target.value;
                  setFormData({ ...formData, serialNumbers: updatedSerialNumbers });
                }}
                fullWidth
                required
              />
            </Grid>
          ))}

          {formData.rackNumbers.map((rack, index) => (
            <Grid item xs={12} sm={6} key={`rack-${index}`}>
              <TextField
                label={`Rack Number ${index + 1}`}
                name={`rackNumber${index}`}
                value={rack}
                onChange={(e) => {
                  const updatedRackNumbers = [...formData.rackNumbers];
                  updatedRackNumbers[index] = e.target.value;
                  setFormData({ ...formData, rackNumbers: updatedRackNumbers });
                }}
                fullWidth
                required
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Vendor ID"
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Upload PDF (eBook)</InputLabel>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
            </Button>
            {pdfFile && <Typography variant="body2" sx={{ marginTop: 1 }}>{pdfFile.name}</Typography>}
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 3 }}>
          Save Book
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 3, marginLeft: 2 }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </form>

      <Dialog open={uploadSuccess} onClose={handleDialogClose}>
        <DialogTitle>Upload Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The eBook PDF has been uploaded successfully along with the book details.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddBook;
