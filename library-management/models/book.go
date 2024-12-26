package models

type Book struct {
    ID            uint   `gorm:"primaryKey"`
    Title         string `gorm:"not null"`
    Subtitle      string
    Author        string `gorm:"not null"`
    Edition       int    `gorm:"not null"`         // Changed to int
    Publisher     string
    PublisherYear int    `gorm:"not null"`         // Changed to int
    VendorID      uint   `gorm:"not null"`         // Changed to uint
    SerialNumber  string `gorm:"unique;not null"`
    RackNumber    string `gorm:"not null"`
    Note          string
    EBookPDF      []byte
}

