package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"library-management/models"
	"library-management/handlers" // Ensure you import the handlers package
	"library-management/config"    // Add this import for the config package
)

var DB *gorm.DB

// ConnectDatabase establishes a connection to the PostgreSQL database
func ConnectDatabase() {
	dsn := ""
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	log.Println("Connected to the database successfully!")
}

func main() {
	// Initialize the router
	r := gin.Default()

	// Enable CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Connect to the database
	ConnectDatabase()

	// Initialize the Twilio client
	config.InitTwilio()

	// Auto-migrate models
	DB.AutoMigrate(
		&models.Student{},
		&models.Book{},
		&models.Vendor{},
		&models.Transaction{},
		&models.User{},
	)

	// Register routes for students
	r.GET("/students", func(c *gin.Context) { handlers.GetStudents(c, DB) })
	r.GET("/students/:id", func(c *gin.Context) { handlers.GetStudentByID(c, DB) })
	r.POST("/students", func(c *gin.Context) { handlers.CreateStudent(c, DB) })
	r.PUT("/students/:id", func(c *gin.Context) { handlers.UpdateStudent(c, DB) })
	r.DELETE("/students/:id", func(c *gin.Context) { handlers.DeleteStudent(c, DB) })

	// Register routes for books
	r.GET("/books", func(c *gin.Context) { handlers.GetBooks(c, DB) })
	r.POST("/books", func(c *gin.Context) { handlers.CreateBook(c, DB) })
	r.GET("/books/search", func(c *gin.Context) { handlers.SearchBooksByTitle(c, DB) })
	r.POST("/books/:id/upload", func(c *gin.Context) { handlers.UploadBookFile(c, DB) })
	r.GET("/books/:id/download", func(c *gin.Context) { handlers.DownloadBookFile(c, DB) })
	r.DELETE("/books/:id", func(c *gin.Context) { handlers.DeleteBook(c, DB) }) // Added delete route for books
	r.PUT("/transactions/:id/return", func(c *gin.Context) { handlers.ReturnBook(c, DB) }) // Fixed closing parenthesis here
	r.GET("/books/:id", func(c *gin.Context) {
		handlers.GetBookDetails(c, DB)
	})
	

	// Register routes for vendors
	r.GET("/vendors", func(c *gin.Context) { handlers.GetVendors(c, DB) })
	r.POST("/vendors", func(c *gin.Context) { handlers.CreateVendor(c, DB) })
	r.DELETE("/vendors/:id", func(c *gin.Context) { handlers.DeleteVendor(c, DB) }) // Added delete route for vendors
	r.GET("/vendors/:id", func(c *gin.Context) { handlers.GetVendorByID(c, DB) }) // Fixed this line to use handlers.GetVendorByID

	// Register routes for transactions
	r.GET("/transactions", func(c *gin.Context) { handlers.GetTransactions(c, DB) })
	r.POST("/transactions", func(c *gin.Context) { handlers.CreateTransaction(c, DB) })
	r.DELETE("/transactions/:id", func(c *gin.Context) { handlers.DeleteTransaction(c, DB) }) // Added delete route for transactions
	r.GET("/transactions/search", func(c *gin.Context) { handlers.SearchTransactions(c, DB) })

	// Basic health check endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Server is running"})
	})

	// Register login route
	r.POST("/login", func(c *gin.Context) { handlers.Login(c, DB) })

	// Register user creation route
	r.POST("/register", func(c *gin.Context) { handlers.CreateUser(c, DB) })

	// Trigger reminder check (e.g., via HTTP request or scheduled task)
	r.GET("/send-reminders", func(c *gin.Context) {
		// Retrieve query parameters (student_id or usn)
		studentID := c.DefaultQuery("student_id", "")
		usn := c.DefaultQuery("usn", "")
	
		// Validate inputs (ensure at least one parameter is provided)
		if studentID == "" && usn == "" {
			c.JSON(400, gin.H{
				"message": "Please provide either student_id or usn.",
			})
			return
		}
	
		// Call the function to send reminders to the specific student
		err := handlers.SendReminderForSpecificStudent(DB, studentID, usn)
	
		if err != nil {
			// Handle error response
			c.JSON(500, gin.H{
				"message": "Error sending reminders",
				"error":   err.Error(),
			})
		} else {
			// Success response
			c.JSON(200, gin.H{"message": "Reminder check triggered"})
		}
	})
	

	// Start the server on port 8008
	r.Run(":8008")
}
