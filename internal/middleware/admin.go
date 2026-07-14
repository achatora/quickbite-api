package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
)

func AdminMiddleware(next echo.HandlerFunc) echo.HandlerFunc {

	return func(c echo.Context) error {

		userID, ok := c.Get("user_id").(int)

		if !ok {
			return c.JSON(http.StatusInternalServerError, helpers.Error("User ID not found", 500))
		}

		var role string

		query := "SELECT role FROM users WHERE id = $1"
		err := database.Pool.QueryRow(c.Request().Context(), query, userID).Scan(&role)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, helpers.Error("Failed to get user role", 500))
		}

		if role != "admin" {
			return c.JSON(http.StatusForbidden, helpers.Error("Forbidden: admin access required", 403))
		}

		return next(c)
	}
}
