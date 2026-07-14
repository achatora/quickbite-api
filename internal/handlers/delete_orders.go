package handlers

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
)

func HandleDeleteOrder(c echo.Context) error {

	// 1. Get the order ID from the URL parameter
	orderID := c.Param("id")

	// 2. Get the user ID from the context (set by middleware)
	userID, ok := c.Get("user_id").(int)
	if !ok {
		c.Logger().Error("USER ID NOT FOUND")
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	// We get the "id" fron url /orders/:id and convert to int
	id, err := strconv.Atoi(orderID)

	// check for error, if user passes /orders/"abc" then error because abc is not an int,  but if /orders/"3" then no error because data type is actually a number and we can convert that
	if err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	// Our sql query to delete order from orders table
	query := `DELETE FROM orders WHERE id = $1 AND user_id = $2`

	// .Exec takes two things, messeage response for what was executed and error
	result, err := database.Pool.Exec(c.Request().Context(), query, id, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	// query worked but if no rows were deleted still then the order does not exist, in this case we use StatusNotFound
	if result.RowsAffected() == 0 {
		return c.JSON(http.StatusNotFound, helpers.Error("Order not found", 404))
	}

	// return message to user "message": "Order {id} has been cancelled" when user cancels and order.
	return c.JSON(http.StatusOK, helpers.Success("Order "+orderID+" has been cancelled", nil))
}
