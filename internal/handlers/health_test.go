package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/stretchr/testify/assert"
)

func TestHandleHealthCheck(t *testing.T) {

	// 1. SETUP
	// 1a. Load enviroment variables
	err := godotenv.Load(".env")
	if err != nil {
		t.Skip("Skipping test: .env file not found")
	}

	// 1b. Initialize database before test
	database.InitDB() // Connect to Database
	defer database.Pool.Close()

	e := echo.New()                                                  // Create Echo insance
	req := httptest.NewRequest(http.MethodGet, "/health_check", nil) // Fake request (GET request)
	rec := httptest.NewRecorder()                                    // Fake response
	c := e.NewContext(req, rec)                                      // Fake context, holds request and response as would context in real production

	// 2. CALL - Call and test the actual code (handler, jwt, etc) you are testing
	err = HandleGetHealth(c)

	// 3. ASSERT - Verify the results
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)
}
