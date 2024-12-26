package handlers

import (
	"net/http"
	"library-management/models"
	"library-management/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Login handles user login by validating credentials
func Login(c *gin.Context, db *gorm.DB) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Bind the JSON input to the struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.User

	// Retrieve the user from the database
	if err := db.Where("username = ?", input.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Compare the password with the hash
	if !utils.CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Successful login
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}
