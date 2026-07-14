package middleware

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/helpers"
	"github.com/siralfredthegreat/quickbite-api/internal/utils"
)

func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {

	return func(c echo.Context) error {

		// Get the Authorization header from the incoming request. If it's missing, return an unauthorized error.
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(http.StatusUnauthorized, helpers.Error("Missing authorization header", 401))
		}
		// Split the Authorization header to extract the token. The expected format is "Bearer <token>". If the format is incorrect, return an error.
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.JSON(http.StatusUnauthorized, helpers.Error("Invalid authorization format", 401))
		}
		// Extract the token string from the header.
		tokenString := parts[1]

		// Validate the token using the ValidateToken function from the utils package. If the token is invalid or expired, return an unauthorized error.
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, helpers.Error("Invalid or expired token", 401))
		}

		// Set the user ID from the claims into the context for use in subsequent handlers. This allows other parts of the application to access the authenticated user's ID.
		c.Set("user_id", claims.UserID)

		// Call the next handler in the chain, allowing the request to proceed to the intended endpoint.
		return next(c)

	}
}
