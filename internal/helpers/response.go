package helpers

import "github.com/siralfredthegreat/quickbite-api/internal/models"

func Error(message string, code int) models.Error {
	return models.Error{
		Success: false,
		Message: message,
		Code:    code,
	}
}

func Success(message string, data any) models.Success {
	return models.Success{
		Success: true,
		Message: message,
		Code:    200,
		Data:    data,
	}
}

func SuccessWithCode(message string, code int, data any) models.Success {
	return models.Success{
		Success: true,
		Message: message,
		Code:    code,
		Data:    data,
	}
}
