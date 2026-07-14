package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
)

func HandleUpdateOrderStatus(c echo.Context) error {
	// 1. Grab the ID from the URL (e.g., "/orders/3/status" -> "3")
	orderID := c.Param("id")

	// 2. Prepare our empty container using the blueprint
	var input models.UpdateStatusInput

	// 3. Pour the incoming JSON data into our container
	err := c.Bind(&input)
	if err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	if err := validator.Validate.Struct(input); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error(err.Error(), 400))
	}

	// 4. Define our whitelist map of accepted statuses
	vdCheck := map[string]bool{
		"pending":          true,
		"preparing":        true,
		"ready for pickup": true,
		"completed":        true,
	}

	// 5. Validate the incoming status against our map
	// If the status isn't a key in the map, Go returns 'false'.
	// Flipped by '!', this block triggers and rejects bad data!

	// shorthand way of checking a map is: if !<map-name>[<container with argument/data>] {...}
	// example is shown below, it is asking, does the data in input.Status match any of the key pairs we have in vdCheck.
	if !vdCheck[input.Status] {
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid status value", 400))
	}

	// 6. Write the SQL Query update command targetting only this ID $2
	query := "UPDATE orders SET status = $1 WHERE id = $2"

	// 7. Tell Postgres to execute the command with our values
	_, err = database.Pool.Exec(c.Request().Context(), query, input.Status, orderID)
	if err != nil {
		c.Logger().Error("DATABASE UPDATE ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, order status not updated", 500))
	}

	return c.JSON(http.StatusOK, helpers.Success("Order "+orderID+" status updated to "+input.Status, nil))

}
