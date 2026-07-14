package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Conn is a global variable that holds the database connection.
// It is initialized in the InitDB function and can be used throughout the application to interact with the database.
var Pool *pgxpool.Pool

func InitDB() {

	// Load environment variables from .env file
	poolStr := os.Getenv("DATABASE_URL") // Get the database connection string from environment variables (.env file).
	if poolStr == "" {
		log.Fatal("DATABASE_URL enviroment variable is not set")
	}

	// Connect to the database using the connection string
	var err error
	Pool, err = pgxpool.New(context.Background(), poolStr) // Connect to the PostgreSQL database using the connection string from environment variables (.env)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	// Sometimes a connection can appear successful but the database isn't actually responding. This catches that situation.
	err = Pool.Ping(context.Background()) // Ping the database to check if the connection is successful.
	if err != nil {
		log.Fatalf("Unable to ping the database: %v\n", err)
	}

	fmt.Println("Successfully connected to the PostgreSQL database!") // Log a success message to the console.
}
