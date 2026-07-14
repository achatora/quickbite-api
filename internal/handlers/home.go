package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
)

func HandleHome(c echo.Context) error {
	return c.JSON(http.StatusOK, helpers.Success("Welcome to QuickBite API!", nil))
}
