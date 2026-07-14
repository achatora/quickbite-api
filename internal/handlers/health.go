package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
)

func HandleGetHealth(c echo.Context) error {

	err := database.Pool.Ping(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusServiceUnavailable, helpers.Error("Database connection failed", 503))
	}

	return c.JSON(http.StatusOK, helpers.Success("Server is healthy", map[string]string{
		"status":   "ok",
		"database": "connected",
	}))
}
