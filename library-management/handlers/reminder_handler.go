package handlers

import (
	"library-management/config"
	"library-management/models"
	"log"
	"strings"
	"time"
	"gorm.io/gorm"
)

// SendReminderForSpecificStudent sends a reminder for a specific student based on student_id or usn
func SendReminderForSpecificStudent(db *gorm.DB, studentID, usn string) error {
	var transactions []models.Transaction

	// Query by student_id or usn (whichever is provided)
	query := db.Model(&models.Transaction{})

	if studentID != "" {
		query = query.Where("student_id = ?", studentID)
	}
	if usn != "" {
		query = query.Where("student_usn = ?", usn)
	}

	if err := query.Find(&transactions).Error; err != nil {
		return err
	}

	// For each transaction, send a reminder
	for _, transaction := range transactions {
		var student models.Student
		if err := db.First(&student, "usn = ?", transaction.StudentUSN).Error; err != nil {
			log.Println("Error fetching student:", err)
			continue
		}

		// Validate phone number before sending the reminder
		if student.Phone == "" {
			log.Println("Error: Invalid phone number for student:", student.Name)
			continue
		}

		// Ensure the phone number is in E.164 format (e.g., +1234567890)
		if !strings.HasPrefix(student.Phone, "+") {
			student.Phone = "+91" + student.Phone // Example for US, adjust as necessary
		}

		dueDate := transaction.DueDate.Format("2006-01-02")
		// Call the SendDueDateReminder function from config
		err := config.SendDueDateReminder(student.Phone, dueDate, student.Name)
		if err != nil {
			log.Println("Error sending reminder:", err)
		}
	}

	return nil
}

// CheckDueDatesAndSendReminders checks all due dates within the next 2 days and sends reminders
func CheckDueDatesAndSendReminders(db *gorm.DB) {
	transactions := []models.Transaction{}
	// Fetch transactions where due date is within the next 2 days
	if err := db.Where("due_date <= ?", time.Now().AddDate(0, 0, 2)).Find(&transactions).Error; err != nil {
		log.Println("Error fetching transactions:", err)
		return
	}

	for _, transaction := range transactions {
		// Ensure the student is preloaded
		var student models.Student
		if err := db.First(&student, "usn = ?", transaction.StudentUSN).Error; err != nil {
			log.Println("Error fetching student with USN:", transaction.StudentUSN, err)
			continue
		}

		// Validate phone number before sending the reminder
		if student.Phone == "" {
			log.Println("Error: Invalid phone number for student:", student.Name)
			continue
		}

		// Ensure the phone number is in E.164 format (e.g., +1234567890)
		if !strings.HasPrefix(student.Phone, "+") {
			student.Phone = "+1" + student.Phone // Example for US, adjust as necessary
		}

		// Format the due date for the message
		dueDate := transaction.DueDate.Format("2006-01-02")

		// Send the reminder message
		err := config.SendDueDateReminder(student.Phone, dueDate, student.Name)
		if err != nil {
			log.Println("Error sending reminder:", err)
		}
	}
}
