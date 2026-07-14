package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"

	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/utils"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
)

func HandleUserLogin(c echo.Context) error {
	var login models.LoginRequest

	if err := c.Bind(&login); err != nil {
		c.Logger().Error("BIND ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Invalid format request", 400))
	}
	if err := validator.Validate.Struct(login); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error(err.Error(), 400))
	}

	var user models.User

	query := `SELECT id, name, surname, email, password, role FROM users WHERE email = $1`

	err := database.Pool.QueryRow(c.Request().Context(),
		query,
		login.Email).Scan(
		&user.ID,
		&user.Name,
		&user.Surname,
		&user.Email,
		&user.Password,
		&user.Role,
	)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return c.JSON(http.StatusNotFound, helpers.Error("User not found", 404))
		}
		c.Logger().Error("DATABASE ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password))
	if err != nil {
		return c.JSON(http.StatusUnauthorized, helpers.Error("Invalid credentials", 401))
	}

	user.Password = ""

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, helpers.Error("Invalid token, failed login request", 401))
	}

	return c.JSON(http.StatusOK, helpers.Success("Successfull login", map[string]interface{}{
		"user":  user,
		"token": token,
	}))
}
