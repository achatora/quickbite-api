package main

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/routes"
)

func main() {
	err := godotenv.Load() // Load environment variables from .env file
	if err != nil {
		log.Println("Error loading .env file")
	}

	// Check if the JWT_AUTH_URL environment variable is set, if not, log a fatal error and exit the application.
	if os.Getenv("JWT_AUTH_URL") == "" {
		log.Fatal("JWT_AUTH_URL environment variable is not set")
	}

	database.InitDB()           // Initialize the database connection.
	defer database.Pool.Close() // Close the database connection when the application exits.

	// Create a new Echo instance for handling HTTP requests and responses.
	e := echo.New()

	// Middleware
	e.Use(middleware.RequestLogger()) // This is how you see live traffic logs hitting your server.
	e.Use(middleware.Recover())       // This is how you recover from panics and return a 500 error instead of crashing the server.
	e.Use(middleware.CORS())          // This is how you allow cross-origin requests from your frontend to your backend.

	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(20)))    // 20 requests per second, prevents spam towards your API
	e.Use(middleware.ContextTimeoutWithConfig(middleware.ContextTimeoutConfig{ //  Prevents slow requests from hanging forever and tying up server resources.
		Timeout: 30 * time.Second, // If a request takes longer than 30 seconds, it cancels it and returns an error.
	}))

	// Setup routes
	routes.SetupRoutes(e)

	// Start the server
	port := os.Getenv("PORT") // Get the port from environment variables, default to 8081 if not set.
	if port == "" {           // If the port is not set, use the default.
		port = "8081" // Default port if not specified in environment variables.
	}

	log.Println("Server is running on http://localhost:" + port) // Log the server URL to the console for easy access.
	e.Logger.Fatal(e.Start(":" + port))                          // Start the server on port 8081 and log any fatal errors that occur during startup.

}
