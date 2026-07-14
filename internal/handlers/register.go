package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/database"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
	"github.com/siralfredthegreat/quickbite-api/internal/validator"
	"golang.org/x/crypto/bcrypt"
)

func HandleCreateUser(c echo.Context) error {
	var register models.User

	if err := c.Bind(&register); err != nil {
		c.Logger().Error("BIND ERROR: ", err)
		return c.JSON(http.StatusBadRequest, helpers.Error("Invalid request format", 400))
	}

	if err := validator.Validate.Struct(register); err != nil {
		return c.JSON(http.StatusBadRequest, helpers.Error(err.Error(), 400))
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		c.Logger().Error("HASH ERROR: ", err)
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to create password", 500))
	}
	hashedPassword := string(hashedBytes)

	query := ` INSERT INTO users (name, surname, email, password, role)
		VALUES ($1, $2, $3, $4, 'customer')
		RETURNING id 
	`
	err = database.Pool.QueryRow(c.Request().Context(),
		query,
		register.Name,
		register.Surname,
		register.Email,
		hashedPassword).Scan(&register.ID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, helpers.Error("Server error, failed to process data", 500))
	}

	register.Password = ""
	register.Role = "customer"

	return c.JSON(http.StatusCreated, helpers.SuccessWithCode("Password successfully created", 201, register))
}
