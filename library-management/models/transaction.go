package models

import "time"

type Transaction struct {
    ID           uint      `gorm:"primaryKey" json:"id"`
    StudentUSN   string    `gorm:"not null" json:"student_usn"`   // Foreign key to Student.USN
    BookID       uint      `gorm:"not null" json:"book_id"`       // Foreign key to Book.ID (Book's primary key)
    IssueDate    time.Time `json:"issue_date"`
    DueDate      time.Time `json:"due_date"`
    ReturnDate   *time.Time `json:"return_date"` // Nullable field
    LateFee      float64   `json:"late_fee"`

    Student Student `gorm:"foreignKey:StudentUSN;references:USN" json:"student"`
    Book    Book    `gorm:"foreignKey:BookID;references:ID" json:"book"`
}
