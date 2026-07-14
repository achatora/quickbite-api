package models

type Order struct {
	ID         int     `json:"id"`
	MenuID     int     `json:"menu_id" validate:"required,gt=0,lt=10000"`
	UserID     int     `json:"user_id"`
	ItemName   string  `json:"item_name"`
	Quantity   int     `json:"quantity" validate:"required,gt=0,lt=21"`
	Notes      string  `json:"notes" validate:"omitempty,max=500"`
	TotalPrice float64 `json:"total_price"`
	Status     string  `json:"status"`
}

type UpdateStatusInput struct {
	Status string `json:"status" validate:"required"`
}
