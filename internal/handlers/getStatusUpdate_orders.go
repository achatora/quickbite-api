package handlers

import (
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
)

func HandleGetOrderStatus(c echo.Context) error {
	// 1. Grab the ID from the URL (e.g., "/orders/3" -> "3")
	orderID := c.Param("id")

	// NEW VALIDATION GUARD GOES HERE:
	// Try to convert the string orderID (like "3" or "apple") into a real integer.
	id, err := strconv.Atoi(orderID)
	if err != nil {
		// If the conversion failed, we return a 400 Bad Request immediately and stop!
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	// 2. Prepare an empty container using our existing Order struct.
	var cmp models.Order

	// 3. Write the SQL query to find this exact order.
	query := "SELECT id, item_name, quantity, notes, total_price, status FROM orders WHERE id = $1"

	// 4. Query the database AND scan the database columns directly into our struct fields.
	// NOTICE: We now pass our clean, validated integer 'id' here instead of 'orderID'!
	err = database.Pool.QueryRow(c.Request().Context(), query, id).Scan(
		&cmp.ID,
		&cmp.ItemName,
		&cmp.Quantity,
		&cmp.Notes,
		&cmp.TotalPrice,
		&cmp.Status,
	)

	// 5. Handle any errors during the query or scan
	if err != nil {
		if err == pgx.ErrNoRows {
			return c.JSON(http.StatusNotFound, helpers.Error("Order not found", 404))
		}
		c.Logger().Error("DATABASE SELECT ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to retrieve status update", 500))
	}

	// 6. Return the entire filled order struct as JSON!
	return c.JSON(http.StatusOK, helpers.Success("Order status retrieved successfully", cmp))
}
