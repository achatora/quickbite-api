package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
)

func HandleGetMenu(c echo.Context) error {
	// 1. Write the raw SQL query to grab our food items
	query := "SELECT id, name, description, price, is_available FROM menu_items"

	// 2. Execute the query against our persistent database connection
	// database.Conn.Query the live telephone wire linking Go to your Docker database container, .Query() sends your SQL instruction down that wire.
	// The database processes it and shoots back a packet of data, which Go stores in a variable called rows
	// If the wire is broken or the table doesn't exist, it fills up err instead, and the function stops immediately to protect the app from crashing.
	rows, err := database.Pool.Query(c.Request().Context(), query)
	if err != nil {
		c.Logger().Error("MENU DATABASE ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Failed to process data", 500))
	}
	defer rows.Close() // Clean up the connection when this function finishes

	// 3. Create an empty list (slice) to hold our menu items
	var menu []models.MenuItem

	// 4. Loop through every row returned by the database
	/*
		This is the loop engine. When the database returns data, it sends it back like a raw text spreadsheet.
		Go can't read a raw spreadsheet directly—it needs to translate it row-by-row.
	*/
	for rows.Next() {
		var item models.MenuItem

		err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.Price, &item.IsAvailable)
		if err != nil {
			c.Logger().Error("MENU ROW SCAN ERROR: ", err)
			return c.JSON(http.StatusInternalServerError, helpers.Error("Failed to process data", 500))
		}

		// Append the fully loaded item to our menu list
		menu = append(menu, item)
	}

	return c.JSON(http.StatusOK, helpers.Success("Success, menu retrieved", menu))
}
