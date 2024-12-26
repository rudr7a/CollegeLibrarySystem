package handlers

import (
	"net/http"
	"time"
    "fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"library-management/models"
)

func GetTransactions(c *gin.Context, db *gorm.DB) {
    var transactions []models.Transaction
    result := db.Preload("Student").Preload("Book").Find(&transactions)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if len(transactions) == 0 {
        c.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
        return
    }

    c.JSON(http.StatusOK, transactions)
}



func CreateTransaction(c *gin.Context, db *gorm.DB) {
    var input struct {
        StudentUSN  string `json:"student_usn"`
        SerialNumber string `json:"serial_number"` // Accept serial number instead of book ID
    }

    // Bind the JSON input
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Debugging log to check incoming USN
    fmt.Printf("Received USN: '%s'\n", input.StudentUSN)

    // Check if the student exists with case-insensitive search and trim spaces
    var student models.Student
    if err := db.Where("LOWER(TRIM(usn)) = LOWER(TRIM(?))", input.StudentUSN).First(&student).Error; err != nil {
        fmt.Printf("Student not found, error: %v\n", err)
        c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
        return
    }

    // Find the book by its serial number
    var book models.Book
    if err := db.Where("serial_number = ?", input.SerialNumber).First(&book).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
        return
    }

    // Check if a transaction already exists for the given student and book
    var existingTransaction models.Transaction
    if err := db.Where("student_usn = ? AND book_id = ?", input.StudentUSN, book.ID).First(&existingTransaction).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{
            "error": "A transaction already exists for this student and book",
        })
        return
    }

    // Create a new transaction
    transaction := models.Transaction{
        StudentUSN: input.StudentUSN,
        BookID:     book.ID,  // Use the book ID from the found book
        IssueDate:  time.Now(),
        DueDate:    time.Now().AddDate(0, 0, 14), // Default 2-week due date
    }

    if err := db.Create(&transaction).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, transaction)
}



// Delete a transaction
func DeleteTransaction(c *gin.Context, db *gorm.DB) {
	transactionID := c.Param("id")
	if result := db.Delete(&models.Transaction{}, transactionID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted successfully"})
}

func SearchTransactions(c *gin.Context, db *gorm.DB) {
    var transactions []models.Transaction

    // Get query parameters
    serialNumber := c.Query("serial_number")
    studentUSN := c.Query("student_usn")

    // Base query
    query := db.Preload("Student").Preload("Book")

    // If serial number is provided, find matching transactions by serial number
    if serialNumber != "" {
        query = query.Joins("JOIN books ON books.id = transactions.book_id").
            Where("books.serial_number = ?", serialNumber)
    }

    // If student USN is provided, filter by student USN
    if studentUSN != "" {
        query = query.Where("student_usn = ?", studentUSN)
    }

    // Execute the query
    result := query.Find(&transactions)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if len(transactions) == 0 {
        c.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
        return
    }

    c.JSON(http.StatusOK, transactions)
}
