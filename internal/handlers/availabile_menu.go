package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
)

func HandleAvailabilityMenu(c echo.Context) error {

	orderID := c.Param("id")

	var available models.UpdateAvailableMenuItems

	err := c.Bind(&available)
	if err != nil {
		c.Logger().Error("BIND ERROR: ", err)
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	if err := validator.Validate.Struct(available); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	id, err := strconv.Atoi(orderID)
	if err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	query := "UPDATE menu_items SET is_available = $1 WHERE id = $2"

	result, err := database.Pool.Exec(c.Request().Context(), query, available.IsAvailable, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	if result.RowsAffected() == 0 {
		return c.JSON(http.StatusNotFound, helpers.Error("Menu item not found", 404))
	}

	return c.JSON(http.StatusOK, helpers.Success("Menu availability successfully updated", nil))
}
