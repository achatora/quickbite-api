package handlers

import (
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
)

func HandleUserProfile(c echo.Context) error {
	var profile models.User

	userID, ok := c.Get("user_id").(int)
	if !ok {
		return c.JSON(http.StatusInternalServerError, helpers.Error("User ID not found", 500))
	}

	query := "SELECT name, surname, email, role FROM users WHERE id = $1"

	err := database.Pool.QueryRow(c.Request().Context(),
		query,
		userID).Scan(
		&profile.Name,
		&profile.Surname,
		&profile.Email,
		&profile.Role,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return c.JSON(http.StatusNotFound, helpers.Error("User not found", 404))
		}
		c.Logger().Error("DATABASE ERROR DETAILS: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	response := models.UserProfileResponse{
		ID:      userID,
		Name:    profile.Name,
		Surname: profile.Surname,
		Email:   profile.Email,
		Role:    profile.Role,
	}

	return c.JSON(http.StatusOK, helpers.Success("User profile found", response))
}
