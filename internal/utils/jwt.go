package utils

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/siralfredthegreat/quickbite-api/internal/models"
)

func GenerateToken(userID int) (string, error) {

	// Get the JWT secret key from environment variables. If it's not set, return an error.
	jwtSecretKey := os.Getenv("JWT_AUTH_URL")
	if jwtSecretKey == "" {
		return "", fmt.Errorf("JWT_AUTH_URL enviroment variable not set")
	}

	// Create a new instance of Claims with the user ID and set the expiration time to 24 hours from now.
	claims := models.Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Create a new JWT token with the claims and sign it using the secret key. Return the signed token string.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecretKey))

}

func ValidateToken(tokenString string) (*models.Claims, error) {

	jwtSecretKey := os.Getenv("JWT_AUTH_URL")
	if jwtSecretKey == "" {
		return nil, fmt.Errorf("JWT_AUTH_URL enviroment variable not set")
	}

	token, err := jwt.ParseWithClaims(tokenString, &models.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*models.Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
