package config

import (
	"log"
	"fmt"
	"github.com/twilio/twilio-go"
	api "github.com/twilio/twilio-go/rest/api/v2010"
)

var client *twilio.RestClient


// InitTwilio initializes the Twilio client
func InitTwilio() {
	client = twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: "ACbe643eeee9679f37d5d21248f221b2f8", // Your Twilio Account SID
		Password: "d0db2b3bcb850f5a2600c085712a8c33",  // Your Twilio Auth Token
	})

	if client == nil {
		log.Fatal("Failed to initialize Twilio client.")
	} else {
		log.Println("Twilio client initialized successfully!")
	}
}


// SendSMS sends an SMS message using Twilio
func SendSMS(to, message string) error {
	// Create the message parameters
	params := &api.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom("+12184844884") // Your Twilio phone number
	params.SetBody(message)

	// Send the message using the Twilio client
	_, err := client.Api.CreateMessage(params)
	if err != nil {
		log.Println("Error sending SMS:", err)
		return err
	}

	log.Println("SMS sent successfully!")
	return nil
}
// SendDueDateReminder sends an SMS reminder for the due date
func SendDueDateReminder(phoneNumber, dueDate, studentName string) error {
	// Craft the reminder message
	message := fmt.Sprintf("Hello %s, this is a reminder: Your book is due on %s. Please return it on time.", studentName, dueDate)

	// Use the SendSMS function from config to send the message
	err := SendSMS(phoneNumber, message)
	if err != nil {
		log.Println("Error sending reminder:", err)
		return err
	}

	log.Println("Reminder sent successfully!")
	return nil
}