package models

type MenuItem struct {
	ID          int     `json:"id"`
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Description string  `json:"description" validate:"omitempty,max=500"`
	Price       float64 `json:"price" validate:"required,gt=0,lt=10000"`
	IsAvailable bool    `json:"is_available"`
}

type UpdateAvailableMenuItems struct {
	IsAvailable bool `json:"is_available"`
}
