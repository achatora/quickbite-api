package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
)

func HandleCreateMenuItem(c echo.Context) error {
	var menu models.MenuItem

	if err := c.Bind(&menu); err != nil {
		c.Logger().Error("BIND ERROR: ", err)
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	// Validation Check

	if err := validator.Validate.Struct(menu); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error(err.Error(), 400)) // For validation errors use err.Error(), frontend will know what to fix.
	}

	query := `INSERT INTO menu_items (name, description, price)
	VALUES ($1, $2, $3)
	RETURNING id, name, description, price, is_available
	`

	err := database.Pool.QueryRow(c.Request().Context(), query, menu.Name, menu.Description, menu.Price).Scan(&menu.ID, &menu.Name, &menu.Description, &menu.Price, &menu.IsAvailable)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))

	}

	return c.JSON(http.StatusCreated, helpers.SuccessWithCode("Menu item successfully created", 201, menu))

}
