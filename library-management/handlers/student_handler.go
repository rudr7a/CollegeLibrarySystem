package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"library-management/models"
)

// Get all students
func GetStudents(c *gin.Context, db *gorm.DB) {
	var students []models.Student
	if result := db.Find(&students); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, students)
}

// Get a single student by ID
func GetStudentByID(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	var student models.Student
	if result := db.First(&student, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}
	c.JSON(http.StatusOK, student)
}

// Create a new student
func CreateStudent(c *gin.Context, db *gorm.DB) {
	var student models.Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the student with the same USN already exists
	var existingStudent models.Student
	if result := db.Where("usn = ?", student.USN).First(&existingStudent); result.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student with the same USN already exists"})
		return
	}

	// Set registered and expiry dates
	student.RegisteredAt = time.Now()
	student.ExpiryDate = student.RegisteredAt.AddDate(4, 0, 0)

	if result := db.Create(&student); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, student)
}


// Update an existing student
func UpdateStudent(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	var student models.Student
	if result := db.First(&student, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	var updatedData models.Student
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Model(&student).Updates(updatedData)
	c.JSON(http.StatusOK, student)
}

// Delete a student
func DeleteStudent(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	if result := db.Delete(&models.Student{}, id); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Student deleted successfully"})
}
