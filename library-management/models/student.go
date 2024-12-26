package models

import "time"

type Student struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `json:"name"`
	USN          string    `gorm:"unique" json:"usn"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	Address      string    `json:"address"`
	AdmissionYear int      `json:"admission_year"`
	Department   string    `json:"department"`
	RegisteredAt time.Time `json:"registered_at"`
	ExpiryDate   time.Time `json:"expiry_date"`
	Remark       string    `json:"remark"`
}
