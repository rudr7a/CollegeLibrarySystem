package handlers

import (
	"net/http"
	"library-management/models"
	"library-management/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateUser handles user registration by hashing the password
func CreateUser(c *gin.Context, db *gorm.DB) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Bind JSON input to the struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hash the password before saving
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create the user object
	user := models.User{
		Username: input.Username,
		Password: hashedPassword,
	}

	// Save the user to the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Respond with success message
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}
