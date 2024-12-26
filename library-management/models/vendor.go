package models

type Vendor struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	VendorName  string `json:"vendor_name"`
	Contact     string `json:"contact"`
	Email       string `json:"email"`
	Address     string `json:"address"`
	
}
