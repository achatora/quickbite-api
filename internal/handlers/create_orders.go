package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
)

func HandleCreateOrder(c echo.Context) error {
	var newOrder models.Order

	// 1. Read the JSON payload (now expecting menu_id, quantity, notes)
	if err := c.Bind(&newOrder); err != nil {
		c.Logger().Error("BIND ERROR: ", err)
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	// VALIDATION CHECKS FOR DATA:

	if err := validator.Validate.Struct(newOrder); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error(err.Error(), 400))
	}

	// 2. LOOKUP: Fetch the official name and price from the 'menu' table using the id
	var officialPrice float64
	menuQuery := `SELECT name, price FROM menu_items WHERE id = $1`

	err := database.Pool.QueryRow(c.Request().Context(), menuQuery, newOrder.MenuID).Scan(&newOrder.ItemName, &officialPrice)
	if err != nil {
		c.Logger().Error("MENU LOOKUP ERROR: ", err)
		return c.JSON(http.StatusNotFound, helpers.Error("Menu item not found", 404))
	}

	// 3. MATH: Calculate the total price based on quantity
	newOrder.TotalPrice = officialPrice * float64(newOrder.Quantity)

	// 4. DEFAULT STATE: Always set a new order to pending
	newOrder.Status = "pending"

	userID, ok := c.Get("user_id").(int)
	if !ok {
		c.Logger().Error("USER ID NOT FOUND IN CONTEXT")
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}
	newOrder.UserID = userID
	insertQuery := `
		INSERT INTO orders (user_id, menu_item_id, item_name, quantity, notes, total_price, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`
	// .Exec() is designed for commands where you want to execute SQL and you do not care about receiving any database rows back
	// This would save the order, but we COULD NOT get the new ID back: _, err = database.Conn.Exec(context.Background(), insertQuery, ...)

	// .QueryRow() is designed for queries where you expect the database to return exactly one row of data to your Go code.
	// WHEN TO USE IT:
	// - Any SELECT query that looks up a single record (like GET /orders/:id)
	// - An INSERT query that uses RETURNING to get database-generated values (like id or created_at)
	err = database.Pool.QueryRow(c.Request().Context(), insertQuery, newOrder.UserID, newOrder.MenuID, newOrder.ItemName, newOrder.Quantity, newOrder.Notes, newOrder.TotalPrice, newOrder.Status).Scan(&newOrder.ID)
	if err != nil {
		c.Logger().Error("INSERT DATABASE ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	return c.JSON(http.StatusCreated, helpers.SuccessWithCode("Order successfully created", 201, newOrder))
}
