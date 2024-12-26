package handlers

import (
	"net/http"
	"io"  // Use io instead of ioutil
    "time" // Add this for time-related functions
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"library-management/models"
)

// Get all books
func GetBooks(c *gin.Context, db *gorm.DB) {
    var books []models.Book
    if result := db.Find(&books); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // Books already have nil values for nullable fields, so no need to manually check
    c.JSON(http.StatusOK, books)
}



func CreateBook(c *gin.Context, db *gorm.DB) {
    var bookInput struct {
        Title         string   `json:"title" binding:"required"`
        Subtitle      string   `json:"subtitle"`
        Author        string   `json:"author" binding:"required"`
        Edition       int      `json:"edition" binding:"required"`
        Publisher     string   `json:"publisher"`
        PublisherYear int      `json:"publisher_year"`
        VendorID      int      `json:"vendor_id" binding:"required"`
        Copies        int      `json:"copies" binding:"required,min=1"`
        SerialNumbers []string `json:"serial_numbers" binding:"required"`
        RackNumbers   []string `json:"rack_numbers" binding:"required"`
        Note          string   `json:"note"`
    }

    // Parse and validate JSON payload
    if err := c.ShouldBindJSON(&bookInput); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
        return
    }

    // Ensure the number of serial and rack numbers matches the number of copies
    if len(bookInput.SerialNumbers) != bookInput.Copies || len(bookInput.RackNumbers) != bookInput.Copies {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Number of serial numbers and rack numbers must match the number of copies"})
        return
    }

    // Create books in a loop
    var createdBooks []models.Book
    for i := 0; i < bookInput.Copies; i++ {
        book := models.Book{
            Title:         bookInput.Title,
            Subtitle:      bookInput.Subtitle,
            Author:        bookInput.Author,
            Edition:       bookInput.Edition,
            Publisher:     bookInput.Publisher,
            PublisherYear: bookInput.PublisherYear, // Use direct assignment for int
            VendorID:      uint(bookInput.VendorID), // Convert int to uint
            SerialNumber:  bookInput.SerialNumbers[i],
            RackNumber:    bookInput.RackNumbers[i],
            Note:          bookInput.Note,
        }

        if err := db.Create(&book).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
            return
        }

        createdBooks = append(createdBooks, book)
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Books created successfully", "books": createdBooks})
}



func UploadBookFile(c *gin.Context, db *gorm.DB) {
    // Extract book ID from the URL
    bookID := c.Param("id")

    // Find the book in the database
    var book models.Book
    if err := db.First(&book, bookID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }

    // Handle the file upload
    file, _, err := c.Request.FormFile("ebook_pdf")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File upload error: " + err.Error()})
        return
    }

    // Read the file content into a byte array
    ebookContent, err := io.ReadAll(file)  // Use io.ReadAll instead of ioutil.ReadAll
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading file: " + err.Error()})
        return
    }

    // Update the book's EBookPDF field in the database
    book.EBookPDF = ebookContent
    if err := db.Save(&book).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "book_id": book.ID})
}

func DownloadBookFile(c *gin.Context, db *gorm.DB) {
    bookID := c.Param("id")

    // Find the book in the database
    var book models.Book
    if err := db.First(&book, bookID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }

    if book.EBookPDF == nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No file found for this book"})
        return
    }

    // Serve the file
    c.Header("Content-Disposition", "attachment; filename=ebook.pdf")
    c.Data(http.StatusOK, "application/pdf", book.EBookPDF)
}

// Search books by title
func SearchBooksByTitle(c *gin.Context, db *gorm.DB) {
	title := c.Query("title")
	var books []models.Book
	if result := db.Where("title ILIKE ?", "%"+title+"%").Find(&books); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, books)
}
// Delete a book
func DeleteBook(c *gin.Context, db *gorm.DB) {
	bookID := c.Param("id")
	if result := db.Delete(&models.Book{}, bookID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}
// Return a book
func ReturnBook(c *gin.Context, db *gorm.DB) {
    transactionID := c.Param("id") // Get the transaction ID from the URL
    var transaction models.Transaction

    // Find the transaction
    if err := db.First(&transaction, transactionID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    // Check if the book is already returned
    if transaction.ReturnDate != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Book is already returned"})
        return
    }

    // Set the return date
    now := time.Now()
    transaction.ReturnDate = &now

    // Calculate late fee if the book is returned after the due date
    if now.After(transaction.DueDate) {
        daysLate := int(now.Sub(transaction.DueDate).Hours() / 24)
        lateFeePerDay := 10.0 // Example late fee rate
        transaction.LateFee = float64(daysLate) * lateFeePerDay
    } else {
        transaction.LateFee = 0
    }

    // Save the updated transaction
    if err := db.Save(&transaction).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":      "Book returned successfully",
        "transaction":  transaction,
    })
}

// GetBookDetails fetches details of a book by its ID
func GetBookDetails(c *gin.Context, db *gorm.DB) {
    // Get the book ID from the URL parameter
    bookID := c.Param("id")

    // Find the book in the database
    var book models.Book
    if err := db.First(&book, bookID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    // Return the book details in the response
    c.JSON(http.StatusOK, book)
}

