package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
)

func HandleGetOrders(c echo.Context) error {
	// 1. The Request String: Plain SQL string detailing what do we want to read from the database (orders table)
	query := "SELECT id, item_name, quantity, notes, total_price, status FROM orders"

	// 2. Open the freezer and grab the raw rows of data
	rows, err := database.Pool.Query(c.Request().Context(), query)
	if err != nil {
		c.Logger().Error("DATABASE ERROR DETAILS: ", err)

		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	// 3. Set up an empty serving tray using our central blueprint
	// An empty slice (array list) designed specifically to hold data formatted like our models.Order blueprint. This is our empty serving tray.
	ordersList := []models.Order{}

	// 4. Take the raw data rows and place them onto our serving tray one by one
	for rows.Next() {
		var o models.Order

		// Map the database text/numbers directly into our Go struct fields
		// this will loop over every row in storage, and the data looped over will be appended to ordersList
		err := rows.Scan(&o.ID, &o.ItemName, &o.Quantity, &o.Notes, &o.TotalPrice, &o.Status)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
		}

		// Add this completed order onto our tray
		ordersList = append(ordersList, o)
	}

	// 5. Hand the tray to the customer as clean JSON data
	return c.JSON(http.StatusOK, helpers.Success("Orders retrieved successfully", ordersList))
}
