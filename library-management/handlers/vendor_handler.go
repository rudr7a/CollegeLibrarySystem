package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"library-management/models"
)

// Get all vendors
func GetVendors(c *gin.Context, db *gorm.DB) {
	var vendors []models.Vendor
	if result := db.Find(&vendors); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, vendors)
}

// Create a new vendor
func CreateVendor(c *gin.Context, db *gorm.DB) {
	var vendor models.Vendor
	if err := c.ShouldBindJSON(&vendor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if result := db.Create(&vendor); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, vendor)
}
// Delete a vendor
func DeleteVendor(c *gin.Context, db *gorm.DB) {
	vendorID := c.Param("id")
	if result := db.Delete(&models.Vendor{}, vendorID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Vendor deleted successfully"})
}
// GetVendorByID retrieves the details of a vendor by their ID
func GetVendorByID(c *gin.Context, db *gorm.DB) {
    vendorID := c.Param("id") // Retrieve the vendor ID from the URL parameter
    var vendor models.Vendor

    // Attempt to find the vendor in the database
    if result := db.First(&vendor, vendorID); result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Vendor not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        }
        return
    }

    // Return the vendor details
    c.JSON(http.StatusOK, vendor)
}