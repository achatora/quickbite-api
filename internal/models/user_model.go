package models

type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name" validate:"required,min=2,max=50"`
	Surname  string `json:"surname" validate:"required,min=2,max=50"`
	Email    string `json:"email" validate:"required,email,max=100"`
	Password string `json:"password" db:"-" validate:"required,min=8,max=15"`
	Role     string `json:"role" validate:"omitempty"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
